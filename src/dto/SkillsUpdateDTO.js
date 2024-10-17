class SkillsUpdateDTO {
    constructor({ 
        name, value, parent_attribute
    }) {
        this.name = name;
        this.value = value;
        this.parent_attribute = parent_attribute;
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

module.exports = SkillsUpdateDTO;
