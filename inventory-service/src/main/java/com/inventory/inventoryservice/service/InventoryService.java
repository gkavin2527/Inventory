package com.inventory.inventoryservice.service;

import com.inventory.inventoryservice.dto.AddItemRequest;
import com.inventory.inventoryservice.dto.ItemView;
import com.inventory.inventoryservice.model.*;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final Map<String, ItemState> items = new ConcurrentHashMap<>();

    public ItemView addItem(AddItemRequest req) {
        var category = parseCategory(req.category);
        boolean isPerishable = Boolean.TRUE.equals(req.perishable) || req.expiryDate != null;

        Item item = isPerishable
                ? new PerishableItem(req.name, category, req.minThreshold, req.expiryDate)
                : new NonPerishableItem(req.name, category, req.minThreshold);

        int qty = req.quantity == null ? 0 : req.quantity;

        var state = new ItemState(item, qty);
        items.put(req.name.toLowerCase(), state);
        return toView(state);
    }

    public List<ItemView> listItems() {
        return items.values().stream().map(this::toView).collect(Collectors.toList());
    }

    public Optional<ItemView> getItem(String name) {
        var s = items.get(name.toLowerCase());
        return s == null ? Optional.empty() : Optional.of(toView(s));
    }

    public boolean deleteItem(String name) {
        return items.remove(name.toLowerCase()) != null;
    }

    public Optional<ItemView> setQuantity(String name, int quantity) {
        var s = items.get(name.toLowerCase());
        if (s == null) return Optional.empty();
        s.setQuantity(quantity);
        return Optional.of(toView(s));
    }

    public List<ItemView> listExpired() {
        return items.values().stream()
                .filter(ItemState::isExpired)
                .map(this::toView)
                .collect(Collectors.toList());
    }

    public List<String> generateShoppingListFromStore() {
        return items.values().stream()
                .filter(ItemState::isLowStock)
                .map(s -> s.getItem().getName())
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .collect(Collectors.toList());
    }

    public List<String> generateShoppingListFromMap(Map<String, Integer> stock) {
        int defaultThreshold = 5;
        List<String> result = new ArrayList<>();
        if (stock == null) return result;

        for (var e : stock.entrySet()) {
            if (e.getValue() < defaultThreshold) {
                result.add(e.getKey());
            }
        }
        result.sort(String.CASE_INSENSITIVE_ORDER);
        return result;
    }

    private Category parseCategory(String raw) {
        if (raw == null) return Category.OTHER;
        try { return Category.valueOf(raw.trim().toUpperCase()); }
        catch (Exception e) { return Category.OTHER; }
    }

    private ItemView toView(ItemState s) {
        var v = new ItemView();
        v.name = s.getItem().getName();
        v.category = s.getItem().getCategory();
        v.quantity = s.getQuantity();
        v.minThreshold = s.getItem().getMinThreshold();
        v.lowStock = s.isLowStock();
        v.expired = s.isExpired();
        if (s.getItem() instanceof PerishableItem p) {
            v.expiryDate = p.getExpiryDate();
        }
        return v;
    }
}
