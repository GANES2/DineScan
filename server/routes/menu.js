const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Public: Get all menus with categories
router.get('/', async (req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      include: { category: true },
      orderBy: { name: 'asc' },
    });
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ menus, categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menus' });
  }
});

// Admin only: Create/Update/Delete menu
router.post('/', authenticate, authorize(['ADMIN']), async (req, res) => {
  const { name, description, price, image, categoryId, status } = req.body;
  try {
    const menu = await prisma.menu.create({
      data: { name, description, price, image, categoryId, status },
    });
    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu' });
  }
});

router.put('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  const { name, description, price, image, categoryId, status } = req.body;
  try {
    const menu = await prisma.menu.update({
      where: { id: req.params.id },
      data: { name, description, price, image, categoryId, status },
    });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu' });
  }
});

router.delete('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    await prisma.menu.delete({ where: { id: req.params.id } });
    res.json({ message: 'Menu deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu' });
  }
});

module.exports = router;
