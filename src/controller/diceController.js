const pool = require('../config/database');

async function calculateDice(diceNumber) {
    return Math.floor(Math.random() * diceNumber) + 1;
}

exports.rollDice = async (req, res) => {
    const { diceNumber } = req.body;

    try {
        const result = await calculateDice(diceNumber);
        res.status(200).send({ result }); 
    } catch (error) {
        console.error('Ocorreu um erro ao rolar os dados: ', error);
        res.status(500).send('Ocorreu um erro ao rolar os dados!');
    }
}