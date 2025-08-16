// inventoryService.js
const axios = require('axios');

const BASE_URL = 'http://localhost:8080/inventory'; // your Java microservice URL

// Function to check if service is running
async function checkInventoryService() {
    try {
        const response = await axios.get(`${BASE_URL}/check`);
        return response.data;
    } catch (error) {
        console.error('Error connecting to Inventory Service:', error.message);
        return null;
    }
}

// Function to generate shopping list
async function generateShoppingList(stock) {
    try {
        const response = await axios.post(`${BASE_URL}/generate-shopping-list`, stock);
        return response.data;
    } catch (error) {
        console.error('Error generating shopping list:', error.message);
        return [];
    }
}

module.exports = {
    checkInventoryService,
    generateShoppingList
};
