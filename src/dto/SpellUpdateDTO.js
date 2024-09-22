class SpellUpdateDTO {
    constructor({ 
        name, description, cost, cost_type, diceNumber, diceQtd
    }) {
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.cost_type = cost_type;
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

module.exports = SpellUpdateDTO;
