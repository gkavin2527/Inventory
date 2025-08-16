package com.inventory.inventoryservice.model;

import java.time.LocalDate;

public class PerishableItem extends Item {
    private LocalDate expiryDate;

    public PerishableItem() { super(); }

    public PerishableItem(String name, Category category, int minThreshold, LocalDate expiryDate) {
        super(name, category, minThreshold);
        this.expiryDate = expiryDate;
    }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}
