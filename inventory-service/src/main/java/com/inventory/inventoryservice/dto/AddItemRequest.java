package com.inventory.inventoryservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class AddItemRequest {
    public String name;
    public String category;      // "GROCERY", etc.
    public int minThreshold;     // e.g. 5
    public Integer quantity;     // default 0 if null
    public Boolean perishable;   // optional
    @JsonFormat(pattern = "yyyy-MM-dd")
    public LocalDate expiryDate; // only if perishable
}
