import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-secret-key-1234567890123456'; // Should be 32 chars in prod

export const encryptData = (data: any): string => {
  const stringData = typeof data === 'string' ? data : JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringData, ENCRYPTION_KEY).toString();
};

export const decryptData = (ciphertext: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
    try {
      return JSON.parse(decryptedText);
    } catch {
      return decryptedText;
    }
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
