import { configDotenv } from 'dotenv';
import pkg from 'pg';
configDotenv()
const {Client} = pkg

let postgresDb = null;

export async function connectPostgres() {
    if(postgresDb) return postgresDb;

    postgresDb =  new Client({connectionString:process.env.DATABASE_URL});

    try {
        await postgresDb.connect();
        console.log('db connected.');
        return postgresDb;
    } 
    catch (error) {
        console.log('error in connecting db.',error);
        
    }
}
