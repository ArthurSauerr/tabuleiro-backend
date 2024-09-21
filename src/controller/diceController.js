async function calculateDice(diceNumber, diceQtd) {
    const results = [];
    for(let i = 0; i < diceQtd; i++){
        const dice = (Math.floor(Math.random() * diceNumber) + 1);
        results.push(dice);
    }
    return results;
    
}

exports.rollDice = async (req, res) => {
    const { diceNumber, diceQtd } = req.body;

    try {
        const result = await calculateDice(diceNumber, diceQtd);
        res.status(200).send({ result }); 
    } catch (error) {
        console.error('Ocorreu um erro ao rolar os dados: ', error);
        res.status(500).send('Ocorreu um erro ao rolar os dados!');
    }
}