import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//connectDB() is not an Express route. 
// It is just a normal function that runs when the server starts.
//hense not use a async handler here

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
            dbName: DB_NAME,
            serverSelectionTimeoutMS: 10000
        })
        console.log(`MongoDB conected !! Host: ${connectionInstance.connection.host}`);

    }catch(error){
        console.log('Error connecting to database:', error);
        process.exit(1);
    }
}

export default connectDB;