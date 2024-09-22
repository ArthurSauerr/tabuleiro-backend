CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE character(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    class VARCHAR(100) NOT NULL,
    sub_class VARCHAR(100),
    nacionality VARCHAR(100),
    max_health NUMERIC(10,2),
    current_health NUMERIC(10,2),
    max_stamina NUMERIC(10,2),
    current_stamina NUMERIC(10,2),
    max_mana NUMERIC(10,2),
    current_mana NUMERIC(10,2),
    max_sanity NUMERIC(10,2),
    current_sanity NUMERIC(10,2),
    money NUMERIC(10,2) NOT NULL,
    user_id UUID,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE attributes(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    value INT NOT NULL,
    character_id INT NOT NULL,
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES character(id)
);

CREATE TABLE inventory(
    id SERIAL PRIMARY KEY,
    item VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    weight NUMERIC(10,2),
    diceNumber INT,
    diceQtd INT,
    character_id INT NOT NULL, 
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES character(id)
);

CREATE TABLE abilities(
    id SERIAL PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    description TEXT,
    character_id INT NOT NULL,
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES character(id)
);

CREATE TABLE spells(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cost INT,
    cost_type VARCHAR(100),
    diceNumber INT,
    diceQtd INT,
    character_id INT NOT NULL,
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES character(id)
);