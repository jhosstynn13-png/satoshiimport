import { Request, Response } from 'express';
import categoriesData from '../../src/data/categories.json';

// In-memory data for demo purposes. Initialized from JSON.
let catalogData = {
  categories: categoriesData
};

export const getCatalog = (req: Request, res: Response) => {
  res.json({ success: true, data: catalogData });
};

export const updateCatalog = (req: Request, res: Response) => {
  catalogData = req.body;
  res.json({ success: true, message: "Catalog updated successfully" });
};
