import { NextFunction, Request, Response } from "express";
import {
  createLifeVaultEntry,
  deleteLifeVaultEntry,
  getLifeVaultByUserId,
} from "../services/lifeVaultService";

export const listLifeVaultDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const documents = await getLifeVaultByUserId(req.user.id);
    return res.status(200).json({ status: "success", data: documents });
  } catch (error) {
    next(error);
  }
};

export const createLifeVaultDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const { title, description, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: "Title and category are required" });
    }

    const document = await createLifeVaultEntry(req.user.id, {
      title,
      description: description || "",
      category,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: `/uploads/${req.file.filename}`,
    });

    return res.status(201).json({ status: "success", data: document });
  } catch (error) {
    next(error);
  }
};

export const deleteLifeVaultDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const document = await deleteLifeVaultEntry(req.user.id, req.params.id);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    return res.status(200).json({ status: "success", data: document });
  } catch (error) {
    next(error);
  }
};
