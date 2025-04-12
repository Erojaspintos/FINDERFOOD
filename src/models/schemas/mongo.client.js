const mongoose = require("mongoose");

const connectMongoDB = async () => {
        const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
        const MONGOD_DATABASE_NAME = process.env.MONGOD_DATABASE_NAME;

        await mongoose.connect(
            `${MONGODB_CONNECTION_STRING}/${MONGOD_DATABASE_NAME}`,{
            serverSelectionTimeoutMS: 3000
        });
        
        console.log("Conexión a MONGODB establecida correctamente.");
};

module.exports = connectMongoDB;