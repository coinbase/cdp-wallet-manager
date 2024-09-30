CREATE TABLE IF NOT EXISTS wallets (
                                        id SERIAL PRIMARY KEY,
                                        wallet_id VARCHAR(255) NOT NULL,
                                        encrypted_seed TEXT NOT NULL
);