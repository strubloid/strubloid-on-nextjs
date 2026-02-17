import mongoose from 'mongoose';

const connection = {};

async function dbConnect()
{
    try {
        if (connection.isConnected) {
            return ;
        }

        const db = await mongoose.connect(process.env.MONGO_URI);

        connection.isConnected = db.connections[0].readyState;

    } catch (e) {
        console.log(e);
    }

}

export default dbConnect;