package com.inventory.inventoryservice.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;


@RestController
@RequestMapping("/purchase")
@CrossOrigin(origins = "*")
public class PurchaseController {

    // POST /purchase/compute
    @PostMapping("/compute")
    public Map<String, Object> computePurchase(@RequestBody Map<String, Object> payload) {
        try {
            List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
            List<Map<String, Object>> computedItems = new ArrayList<>();

            for (Map<String, Object> item : items) {
                String itemId = (String) item.get("itemId");
                int quantity = ((Number) item.get("quantity")).intValue();

                // Example: You can replace this with a real DB or service lookup
                double pricePerUnit = getPriceFromBusinessLogic(itemId);
                double totalPrice = pricePerUnit * quantity;

                Map<String, Object> computed = new HashMap<>();
                computed.put("itemId", itemId);
                computed.put("quantity", quantity);
                computed.put("totalPrice", totalPrice);
                computedItems.add(computed);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("items", computedItems);
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to compute purchase: " + e.getMessage());
            return error;
        }
    }

    // Simulate OOP business logic
    private double getPriceFromBusinessLogic(String itemId) {
        // You can later fetch from DB, apply discounts, etc.
        // For now, return a dummy value based on itemId hash
        return Math.abs(itemId.hashCode() % 100) + 10; // prices between 10 and 110
    }
}
