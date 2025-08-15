const axios = require("axios");


const JAVA_SERVICE_URL = "http://localhost:8080/inventory";

async function generateShoppingList(stock) {
    try {
        const response = await axios.post(`${JAVA_SERVICE_URL}/generate-shopping-list`, stock);
        return response.data; // This is the shopping list
    } catch (error) {
        console.error("Error calling Java service:", error.message);
        return [];
    }
}

module.exports = { generateShoppingList };
