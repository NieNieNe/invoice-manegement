package com.invoice.demo.bill.service;

import com.invoice.demo.bill.dto.BillListResponse;
import com.invoice.demo.bill.dto.CreateBillRequest;
import com.invoice.demo.bill.dto.CreateBillResponse;
import com.invoice.demo.bill.entity.Bill;
import com.invoice.demo.bill.repository.BillRepository;
import com.invoice.demo.purchaseRequest.entity.PurchaseRequest;
import com.invoice.demo.purchaseRequest.repository.PurchaseRequestRepository;
import com.invoice.demo.purchaseRequest.service.PurchaseRequestService;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.Locale;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class BillService {
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf");

    private final BillRepository billRepository;
    private final PurchaseRequestRepository purchaseRequestRepository;
    @Value("${app.storage.bill-dir:uploads/bills}")
    private String billUploadDir;

    @Transactional(readOnly = true)
    public List<BillListResponse> getAllBills() {
        return billRepository.findAllWithInvoiceOrderByCreatedAtDesc().stream()
                .map(this::toListResponse)
                .toList();
    }

    @Transactional
    public CreateBillResponse create(CreateBillRequest request, MultipartFile attachmentFile) {
        PurchaseRequest purchaseRequest = purchaseRequestRepository.findById(request.invoiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase Request not found"));

        if (billRepository.existsByPurchaseRequestId(request.invoiceId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bill already exists for this purchase request");
        }

        StoredAttachment storedAttachment = storeAttachment(purchaseRequest.getId(), attachmentFile);
        Instant now = Instant.now();
        Bill bill = Bill.builder()
                .purchaseRequest(purchaseRequest)
                .totalAmount(request.totalAmount())
                .deadline(request.deadline())
                .createdAt(now)
                .attachmentName(storedAttachment.attachmentName())
                .attachmentPath(storedAttachment.attachmentPath())
                .build();

        Bill savedBill = billRepository.save(bill);

        purchaseRequest.setStatus(PurchaseRequestService.STATUS_AWAITING_PAYMENT);
        purchaseRequestRepository.save(purchaseRequest);

        return new CreateBillResponse(
                savedBill.getId(),
                purchaseRequest.getId(),
                purchaseRequest.getInvoiceNumber(),
                savedBill.getTotalAmount(),
                savedBill.getDeadline(),
                savedBill.getAttachmentName(),
                savedBill.getAttachmentPath(),
                savedBill.getCreatedAt(),
                purchaseRequest.getStatus()
        );
    }

    @Transactional
    public void deleteBill(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bill not found"));

        PurchaseRequest purchaseRequest = bill.getPurchaseRequest();
        boolean shouldResetStatus = PurchaseRequestService.STATUS_AWAITING_PAYMENT.equals(purchaseRequest.getStatus());

        // Keep both sides of the relation consistent before deleting to avoid transient reference issues.
        purchaseRequest.setBill(null);
        bill.setPurchaseRequest(null);
        deleteAttachmentIfExists(bill.getAttachmentPath());
        billRepository.delete(bill);

        if (shouldResetStatus) {
            purchaseRequest.setStatus(PurchaseRequestService.STATUS_OPEN);
            purchaseRequestRepository.save(purchaseRequest);
        }
    }

    private BillListResponse toListResponse(Bill bill) {
        PurchaseRequest purchaseRequest = bill.getPurchaseRequest();
        return new BillListResponse(
                bill.getId(),
                purchaseRequest.getId(),
                purchaseRequest.getInvoiceNumber(),
                purchaseRequest.getCustomerName(),
                bill.getTotalAmount(),
                bill.getDeadline(),
                bill.getAttachmentName(),
                bill.getAttachmentPath(),
                bill.getCreatedAt(),
                purchaseRequest.getStatus()
        );
    }

    private StoredAttachment storeAttachment(Long invoiceId, MultipartFile attachmentFile) {
        if (attachmentFile == null || attachmentFile.isEmpty()) {
            return new StoredAttachment(null, null);
        }

        String originalFilename = attachmentFile.getOriginalFilename();
        String safeFilename = sanitizeFilename(originalFilename);
        String extension = extractExtension(safeFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only image and PDF files are allowed");
        }

        Path uploadRoot = Paths.get(billUploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadRoot);
            String storedFilename = "invoice-" + invoiceId + "-" + UUID.randomUUID() + extension;
            Path target = uploadRoot.resolve(storedFilename).normalize();
            if (!target.startsWith(uploadRoot)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid attachment path");
            }

            try (InputStream inputStream = attachmentFile.getInputStream()) {
                Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
            }
            return new StoredAttachment(safeFilename, storedFilename);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cannot save attachment", exception);
        }
    }

    private void deleteAttachmentIfExists(String attachmentPath) {
        if (attachmentPath == null || attachmentPath.isBlank()) {
            return;
        }

        Path uploadRoot = Paths.get(billUploadDir).toAbsolutePath().normalize();
        Path target = uploadRoot.resolve(attachmentPath).normalize();
        if (!target.startsWith(uploadRoot)) {
            return;
        }

        try {
            Files.deleteIfExists(target);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cannot delete attachment", exception);
        }
    }

    private String sanitizeFilename(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attachment file name is required");
        }
        return Paths.get(fileName).getFileName().toString();
    }

    private String extractExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        if (lastDot < 0 || lastDot == fileName.length() - 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attachment must include a valid extension");
        }
        return fileName.substring(lastDot).toLowerCase(Locale.ROOT);
    }

    private record StoredAttachment(String attachmentName, String attachmentPath) {
    }
}
