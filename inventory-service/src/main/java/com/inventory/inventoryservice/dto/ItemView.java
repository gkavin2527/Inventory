package com.inventory.inventoryservice.dto;

import com.inventory.inventoryservice.model.Category;
import java.time.LocalDate;

public class ItemView {
    public String name;
    public Category category;
    public int quantity;
    public int minThreshold;
    public LocalDate expiryDate; // null if non-perishable
    public boolean lowStock;
    public boolean expired;
}
