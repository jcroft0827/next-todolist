// This will be used to connect to the database if a connection is not already established
// npm install mongoose
import mongoose from "mongoose";

export function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.asPromise();
    } else {
        const uri = process.env.MONGODB_URI;
        return mongoose.connect(uri);
    }
}