package com.inventory.inventoryservice.controller;

import com.inventory.inventoryservice.dto.*;
import com.inventory.inventoryservice.service.InventoryService;
import com.inventory.inventoryservice.model.InventoryItem;
import com.inventory.inventoryservice.model.Item;
import com.inventory.inventoryservice.repository.ItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService service;
    private final ItemRepository itemRepository;

    public InventoryController(InventoryService service, ItemRepository itemRepository) {
        this.service = service;
        this.itemRepository = itemRepository;
    }

    // Health check
    @GetMapping("/check")
    public String check() {
        return "Inventory service is running!";
    }

    // CRUD (in-memory)
    @PostMapping("/items")
    public ItemView addItem(@RequestBody AddItemRequest req) {
        return service.addItem(req);
    }

    @GetMapping("/items")
    public List<ItemView> listItems() {
        return service.listItems();
    }

    @GetMapping("/items/{name}")
    public ItemView getItem(@PathVariable String name) {
        return service.getItem(name)
                .orElseThrow(() -> new RuntimeException("Item not found: " + name));
    }

    @PutMapping("/items/{name}/quantity")
    public ItemView updateQuantity(@PathVariable String name, @RequestBody UpdateQuantityRequest req) {
        return service.setQuantity(name, req.quantity)
                .orElseThrow(() -> new RuntimeException("Item not found: " + name));
    }

    @DeleteMapping("/items/{name}")
    public void deleteItem(@PathVariable String name) {
        if (!service.deleteItem(name)) throw new RuntimeException("Item not found: " + name);
    }

    @GetMapping("/expired")
    public List<ItemView> listExpired() {
        return service.listExpired();
    }

    // Shopping list
    @GetMapping("/shopping-list")
    public List<String> generateShoppingListFromStore() {
        return service.generateShoppingListFromStore();
    }

    @PostMapping("/shopping-list")
    public List<String> generateShoppingListFromMap(@RequestBody ShoppingListRequest req) {
        return service.generateShoppingListFromMap(req.stock);
    }
    @GetMapping("/test-repo")
public List<InventoryItem> testRepo() {
    return itemRepository.findAll();
}

    @PostMapping("/calculate-total")
    public ResponseEntity<Map<String, Object>> calculateTotal(@RequestBody Map<String, Object> request) {
        List<Map<String, Object>> items = (List<Map<String, Object>>) request.get("items");
        List<Map<String, Object>> result = new ArrayList<>();
    
        for (Map<String, Object> item : items) {
            String itemName = (String) item.get("itemId"); // matches MongoDB field "name"
            int quantity = ((Number) item.get("quantity")).intValue();
    
            Optional<InventoryItem> itemDataOpt = itemRepository.findByNameIgnoreCase(itemName);

            if (itemDataOpt.isPresent()) {
                InventoryItem itemData = itemDataOpt.get();
                double totalPrice = itemData.getPrice() * quantity;
                
    
                Map<String, Object> itemResult = new HashMap<>();
                itemResult.put("itemId", itemName);
                itemResult.put("quantity", quantity);
                itemResult.put("totalPrice", totalPrice);
                result.add(itemResult);
            }
        }
    
        Map<String, Object> response = new HashMap<>();
        response.put("items", result);
    
        return ResponseEntity.ok(response);
    }
}    