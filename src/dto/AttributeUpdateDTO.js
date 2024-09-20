class AttributeUpdateDTO {
    constructor({ 
        name, value
    }) {
        this.name = name;
        this.value = value;
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
