import bcrypt from "bcrypt";

const SALT_ROUND: number = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUND);
};

//LEER Y COMPARAR EL HASH BASE DE DATOS

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
