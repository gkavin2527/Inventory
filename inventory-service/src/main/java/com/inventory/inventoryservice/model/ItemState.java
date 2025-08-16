package com.inventory.inventoryservice.model;

import java.time.LocalDate;

public class ItemState {
    private Item item;
    private int quantity;

    public ItemState() {}
    public ItemState(Item item, int quantity) {
        this.item = item;
        this.quantity = quantity;
    }

    public Item getItem() { return item; }
    public int getQuantity() { return quantity; }
    public void setItem(Item item) { this.item = item; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public boolean isLowStock() {
        return quantity < item.getMinThreshold();
    }

    public boolean isExpired() {
        if (item instanceof PerishableItem p) {
            var exp = p.getExpiryDate();
            return exp != null && exp.isBefore(LocalDate.now());
        }
        return false;
    }
}
