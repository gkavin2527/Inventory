package com.inventory.inventoryservice.controller;

import com.inventory.inventoryservice.dto.*;
import com.inventory.inventoryservice.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService service;
    public InventoryController(InventoryService service) { this.service = service; }

    @GetMapping("/check")
    public String check() { return "Inventory service is running!"; }

    // CRUD (in-memory)
    @PostMapping("/items")
    public ItemView addItem(@RequestBody AddItemRequest req) { return service.addItem(req); }

    @GetMapping("/items")
    public List<ItemView> listItems() { return service.listItems(); }

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
    public List<ItemView> listExpired() { return service.listExpired(); }

    // Shopping list (two styles)
    @GetMapping("/shopping-list")
    public List<String> generateShoppingListFromStore() { return service.generateShoppingListFromStore(); }

    @PostMapping("/shopping-list")
    public List<String> generateShoppingListFromMap(@RequestBody ShoppingListRequest req) {
        return service.generateShoppingListFromMap(req.stock);
    }
}
