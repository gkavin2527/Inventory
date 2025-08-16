package com.inventory.inventoryservice.model;

import java.util.Objects;

public abstract class Item {
    private String name;
    private Category category;
    private int minThreshold;

    protected Item() {}

    protected Item(String name, Category category, int minThreshold) {
        this.name = name;
        this.category = category;
        this.minThreshold = minThreshold;
    }

    public String getName() { return name; }
    public Category getCategory() { return category; }
    public int getMinThreshold() { return minThreshold; }

    public void setName(String name) { this.name = name; }
    public void setCategory(Category category) { this.category = category; }
    public void setMinThreshold(int minThreshold) { this.minThreshold = minThreshold; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Item)) return false;
        Item item = (Item) o;
        return name != null && name.equalsIgnoreCase(item.name);
    }
    @Override public int hashCode() {
        return Objects.hash(name == null ? null : name.toLowerCase());
    }
}
