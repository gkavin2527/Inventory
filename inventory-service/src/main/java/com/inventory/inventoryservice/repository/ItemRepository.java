package com.inventory.inventoryservice.repository;

import com.inventory.inventoryservice.model.InventoryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface ItemRepository extends MongoRepository<InventoryItem, String> {
    Optional<InventoryItem> findByNameIgnoreCase(String name); // case-insensitive
}
