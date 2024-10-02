CREATE TABLE IF NOT EXISTS cdp-wallet-manager (
                                        id SERIAL PRIMARY KEY,
                                        wallet_id VARCHAR(255) NOT NULL,
                                        encrypted_seed TEXT NOT NULL
);