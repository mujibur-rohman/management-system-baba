import CryptoJS from "crypto-js";

export const encryptData = (data: any) => {
  const result = CryptoJS.AES.encrypt(data, process.env.NEXT_PUBLIC_SECRET_KEY_ENCRYPT as string).toString();
  return result;
};

export const decryptData = (data: any) => {
  const result = CryptoJS.AES.decrypt(data, process.env.NEXT_PUBLIC_SECRET_KEY_ENCRYPT as string).toString(CryptoJS.enc.Utf8);
  return result;
};
