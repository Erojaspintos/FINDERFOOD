const mongoose = require("mongoose");

const connectMongoDB = async () => {
    try {
        const MONGODB_CONNECTION_STRING = "mongodb+srv://readWriteUserAccess:x0cNbey4sTEjQJJ0@finderfoodcluster.d3mg8fs.mongodb.net/?retryWrites=true&w=majority&appName=FinderFoodCluster";

        const MONGO_DATABASE_NAME = "sample_mflix";

        await mongoose.connect(MONGODB_CONNECTION_STRING, {
            serverSelectionTimeoutMS: 3000,
            dbName: MONGO_DATABASE_NAME,
        });

        console.log("✅ Conexión a MongoDB establecida correctamente.");
    } catch (error) {
        console.error("❌ Error al conectar con MongoDB:", error);
    }
};

(async () => {
    await connectMongoDB();
})();