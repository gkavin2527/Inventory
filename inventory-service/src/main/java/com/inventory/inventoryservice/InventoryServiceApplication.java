package com.inventory.inventoryservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@SpringBootApplication
@RestController
@RequestMapping("/inventory")
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }

    @GetMapping("/check")
    public String checkInventory() {
        return "Inventory service is running!";
    }

    @PostMapping("/generate-shopping-list")
    public List<String> generateShoppingList(@RequestBody Map<String, Integer> stock) {
        List<String> shoppingList = new ArrayList<>();
        for (Map.Entry<String, Integer> item : stock.entrySet()) {
            if (item.getValue() < 5) {
                shoppingList.add(item.getKey());
            }
        }
        return shoppingList;
    }
}
