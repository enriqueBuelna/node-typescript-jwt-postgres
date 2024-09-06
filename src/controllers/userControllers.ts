import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import prisma from "../models/user";
import { error } from "console";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "El email es obligatorio" });
      return;
    }

    if (!password) {
      res.status(400).json({ message: "El email es obligatorio" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(user);
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ message: "El email ingresado ya existe" });
    }

    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({
        error: "No se encontro usuario",
      });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);
  const { email, password } = req.body;

  try {
    let dataToUpdate: any = { ...req.body };

    if (password) {
      const hashedPassword = await hashPassword(password);
      dataToUpdate.password = hashedPassword;
    }

    if (email) {
      dataToUpdate.email = email;
    }

    const user = await prisma.update({
      where: {
        id: userId,
      },
      data: dataToUpdate,
    });
    res.status(200).json(user);
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ message: "El email ingresado ya existe" });
    }

    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);

  try {
    await prisma.delete({
      where: {
        id: userId,
      },
    });

    res
      .status(200)
      .json({
        message: "El usuario ha sido eliminado",
      })
      .end();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};
