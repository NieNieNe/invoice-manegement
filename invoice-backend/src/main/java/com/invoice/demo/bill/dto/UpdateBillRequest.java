package com.invoice.demo.bill.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record UpdateBillRequest(
        @NotBlank(message = "Customer name is required")
        @Size(max = 255, message = "Customer name cannot exceed 255 characters")
        String customerName,

        @NotNull(message = "Total amount is required")
        @DecimalMin(value = "0.01", message = "Total amount must be greater than 0")
        BigDecimal totalAmount,

        @NotBlank(message = "Invoice status is required")
        @Size(max = 30, message = "Invoice status cannot exceed 30 characters")
        String invoiceStatus
) {
}
