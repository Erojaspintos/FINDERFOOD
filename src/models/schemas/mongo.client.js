const mongoose = require("mongoose");

const connectMongoDB = async () => {
        const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
        console.log(MONGODB_CONNECTION_STRING+"database  " +process.env.MONGOD_DATABASE_NAME)
        const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME;

        await mongoose.connect(
            `${MONGODB_CONNECTION_STRING}/${MONGO_DATABASE_NAME}`,{
            serverSelectionTimeoutMS: 3000
        });
        
        console.log("Conexión a MONGODB establecida correctamente.");
};

module.exports = connectMongoDB;