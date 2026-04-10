package com.invoice.demo.bill.controller;

import com.invoice.demo.bill.dto.BillListResponse;
import com.invoice.demo.bill.dto.CreateBillRequest;
import com.invoice.demo.bill.dto.CreateBillResponse;
import com.invoice.demo.bill.service.BillService;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
@Validated
public class BillController {
    private final BillService billService;

    @GetMapping
    public List<BillListResponse> getAllBills() {
        return billService.getAllBills();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public CreateBillResponse createMultipart(
            @RequestParam @NotNull Long invoiceId,
            @RequestParam @NotNull @DecimalMin(value = "0.01", message = "Total amount must be greater than 0") BigDecimal totalAmount,
            @RequestParam @NotBlank String deadline,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        CreateBillRequest request = new CreateBillRequest(
                invoiceId,
                totalAmount,
                parseDeadline(deadline),
                file == null ? null : file.getOriginalFilename()
        );
        return billService.create(request, file);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public CreateBillResponse createJson(@Valid @RequestBody CreateBillRequest request) {
        return billService.create(request, null);
    }

    private Instant parseDeadline(String rawDeadline) {
        if (rawDeadline == null || rawDeadline.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deadline is required");
        }
        try {
            return Instant.parse(rawDeadline);
        } catch (DateTimeParseException ignored) {
            try {
                LocalDateTime localDateTime = LocalDateTime.parse(rawDeadline);
                return localDateTime.atZone(ZoneId.systemDefault()).toInstant();
            } catch (DateTimeParseException ignoredAgain) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid deadline format");
            }
        }
    }
}
