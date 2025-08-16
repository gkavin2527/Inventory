package com.inventory.inventoryservice.model;

public class NonPerishableItem extends Item {
    public NonPerishableItem() { super(); }
    public NonPerishableItem(String name, Category category, int minThreshold) {
        super(name, category, minThreshold);
    }
}
