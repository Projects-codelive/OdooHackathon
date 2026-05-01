import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function encryptPassword(plain: string): string {
  return CryptoJS.AES.encrypt(plain, process.env.AES_SECRET_KEY!).toString();
}

export function decryptPassword(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, process.env.AES_SECRET_KEY!);
  return bytes.toString(CryptoJS.enc.Utf8);
}
