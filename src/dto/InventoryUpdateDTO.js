class InventoryUpdateDTO {
    constructor({ 
        item, quantity, weight, diceNumber, diceQtd
    }) {
        this.item = item;
        this.quantity = quantity;
        this.weight = weight;
        this.diceNumber = diceNumber;
        this.diceQtd = diceQtd;
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
