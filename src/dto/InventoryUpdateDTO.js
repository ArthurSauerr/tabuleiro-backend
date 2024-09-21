class InventoryUpdateDTO {
    constructor({ 
        item, quantity, weight, dice
    }) {
        this.item = item;
        this.quantity = quantity;
        this.weight = weight;
        this.dice = dice;
    }

    sanitize() {
        const sanitizedData = {};
        for (const key in this) {
            if (this[key] !== undefined && this[key] !== null) {
                sanitizedData[key] = this[key];
            }
        }
        return sanitizedData;
    }
}

module.exports = InventoryUpdateDTO;
