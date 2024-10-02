import { Coinbase } from "@coinbase/coinbase-sdk";

if (!process.env.CDP_API_KEY_NAME || !process.env.CDP_API_KEY_SECRET) {
  throw new Error("CDP_API_KEY_NAME and CDP_API_KEY_SECRET must be set");
}

const { CDP_API_KEY_NAME, CDP_API_KEY_SECRET } = process.env;

const apiKeyString = CDP_API_KEY_SECRET as string;

Coinbase.configure({
    apiKeyName: CDP_API_KEY_NAME as string,
    privateKey: apiKeyString.replaceAll("\\n", "\n") as string,
});

