import { Response } from 'express';
import { Page } from '../models/Page';
import { AuthRequest } from '../types';

export const createPage = async (req: AuthRequest, res: Response) => {
  try {
    const { name, color } = req.body;
    const page = new Page({
      name,
      color,
      userId: req.user!.id
    });

    await page.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPages = async (req: AuthRequest, res: Response) => {
  try {
    const pages = await Page.find({ userId: req.user!.id });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const page = await Page.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      { name, color },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deletePage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const page = await Page.findOneAndDelete({
      _id: id,
      userId: req.user!.id
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 