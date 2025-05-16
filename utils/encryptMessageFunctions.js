import dotenv from "dotenv";
import { scryptSync, createCipheriv, createDecipheriv } from "crypto";

dotenv.config();

const key = scryptSync(process.env.SECRET || "default_password", "salt", 32);
const iv = Buffer.alloc(16, 0);

function encrypt(text) {
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  let decrypted =
    decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  return decrypted;
}

export { encrypt, decrypt };
