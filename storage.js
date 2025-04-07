const gastos = [
    {
        "id" : 1,
        "concepto" : "papel higienico",
        "costo": 300,
        "fecha": "2025/03/19",
        "categoria": "baño"
    }
];

const lastId = () => {
    return gastos.length;
}

const getAll = ()=>{
    return gastos;
}

const findGasto = (costoId)=>{
    return gastos.find(gasto=> gasto.id == costoId);
}

const createGasto = (body) => {
    console.log(body);
    const newGasto = {
        "id" : lastId() +1,
        "concepto" : body.concepto,
        "costo" : body.costo,
        "fecha" : new Date().toISOString(),
        "categoria": body.categoria
    };
    gastos.push(newGasto);

    return newGasto;
}

module.exports = {
    getAll,
    findGasto,
    createGasto
}