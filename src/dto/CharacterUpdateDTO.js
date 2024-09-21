class CharacterUpdateDTO {
    constructor({ 
        name, age, char_class,
        char_subclass, nacionality, 
        max_health, current_health, max_stamina, 
        current_stamina, max_mana, current_mana, 
        max_sanity, current_sanity, money
    }) {
        this.name = name;
        this.age = age;
        this.char_class = char_class;
        this.char_subclass = char_subclass;
        this.nacionality = nacionality;
        this.max_health = max_health;
        this.current_health = current_health;
        this.max_stamina = max_stamina;
        this.current_stamina = current_stamina;
        this.max_mana = max_mana;
        this.current_mana = current_mana;
        this.max_sanity = max_sanity;
        this.current_sanity = current_sanity;
        this.money = money;
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

module.exports = CharacterUpdateDTO;
