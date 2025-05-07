const mongoose = require("mongoose");

const connectMongoDB = async () => {
        const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
        const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME;

        await mongoose.connect(
            `${MONGODB_CONNECTION_STRING}`,{
            serverSelectionTimeoutMS: 3000,
            dbName: MONGO_DATABASE_NAME
        });
        
        console.log("Conexión a MONGODB establecida correctamente.");
};

module.exports = connectMongoDB;