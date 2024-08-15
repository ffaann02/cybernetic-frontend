import { useContext } from "react";
import { GameContext, InventoryData } from "../contexts/GameContext";

export const useCharacterInventory = () => {

    const { 
        inventoryItem,
        setInventoryItem, 
        inventoryData,
        setInventoryData,
    } = useContext(GameContext);

    // Function to get the latest ID
    const getLatestInventotyDataId = () => {
        const ids = inventoryData.filter(item => item !== null).map(item => item!.id);
        return ids.length > 0 ? Math.max(...ids) : 0; // Get the max ID or 0 if no items
    };

    const addNewInventoryData = (item: Omit<InventoryData, "id" | "timestamp">) => {
        setInventoryData(prevInventory => {
            const newInventory = [...prevInventory];

            // Check if the item already exists in the inventory (stackable)
            const existingItemIndex = newInventory.findIndex(
                slot => slot?.name === item.name && slot?.data === item.data
            );

            if (existingItemIndex !== -1 && newInventory[existingItemIndex]) {
                // Update the quantity of the existing item
                newInventory[existingItemIndex] = {
                    ...newInventory[existingItemIndex]!,
                    quantity: newInventory[existingItemIndex]!.quantity + item.quantity,
                    timestamp: Date.now(), // Update timestamp to track the latest addition
                };
            } else {
                // Create the new item with the latest ID and current timestamp
                const newItem: InventoryData = {
                    ...item,
                    id: getLatestInventotyDataId() + 1, // Increment the latest ID
                    timestamp: Date.now(),  // Add the current time as the timestamp
                };

                // Find the first empty slot
                const emptyIndex = newInventory.findIndex(slot => slot === null);

                if (emptyIndex === -1) {
                    // Handle inventory full logic here if necessary
                    return prevInventory;
                }

                // Place the new item in the empty slot
                newInventory[emptyIndex] = newItem;
            }

            // Sort the inventory by timestamp to maintain order of addition
            newInventory.sort((a, b) => {
                if (a === null) return 1;
                if (b === null) return -1;
                return a.timestamp - b.timestamp;
            });

            return newInventory;
        });
    };

    const isInventoryItemRemaining = (itemName: string) => {
        return inventoryItem.some(item => item?.name === itemName);
    }

    // Function to completely remove an item by name from the inventory
    const removeInventoryItemByName = (itemName: string) => {
        setInventoryItem(prevInventory =>
            prevInventory.map(item => (item?.name === itemName ? null : item))
        );
    };

    // Function to decrease the quantity of an item by name
    const decreaseInventoryItemQuantityByName = (itemName: string, amount: number = 1) => {
        setInventoryItem(prevInventory =>
            prevInventory.map(item => {
                if (item?.name === itemName) {
                    const newQuantity = item.quantity - amount;
                    // Remove item if quantity reaches 0
                    return newQuantity > 0
                        ? { ...item, quantity: newQuantity }
                        : null;
                }
                return item;
            })
        );
    };

    return { isInventoryItemRemaining, addNewInventoryData, removeInventoryItemByName, decreaseInventoryItemQuantityByName };

};