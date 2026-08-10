import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// In-memory data for demo purposes. Initialized from JSON.
const dataPath = path.join(process.cwd(), 'src', 'data', 'categories.json');
let catalogData = {
  categories: JSON.parse(fs.readFileSync(dataPath, 'utf8'))
};

export const getCatalog = (req: Request, res: Response) => {
  res.json({ success: true, data: catalogData });
};

export const updateCatalog = (req: Request, res: Response) => {
  catalogData = req.body;
  res.json({ success: true, message: "Catalog updated successfully" });
};
