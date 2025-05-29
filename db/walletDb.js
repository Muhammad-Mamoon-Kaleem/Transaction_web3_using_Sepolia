import { connectPostgres } from "./config/postgresConfigration.js";

export const createTables = async () => {
  try {
    const db = await connectPostgres();

    await db.query(
        `
        CREATE TABLE IF NOT EXISTS wallets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        address TEXT UNIQUE NOT NULL,
        encrypted_private_key TEXT NOT NULL,
        iv TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log(" Wallets table created");
  } catch (error) {
    console.error(" Error creating tables:", error);
  }
};

createTables()
