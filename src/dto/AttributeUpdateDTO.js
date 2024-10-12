class AttributeUpdateDTO {
    constructor({ 
        name, value, dicenumber
    }) {
        this.name = name;
        this.value = value;
        this.dicenumber = dicenumber;
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

module.exports = AttributeUpdateDTO;
