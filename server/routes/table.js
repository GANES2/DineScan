const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Public: Get table info by number
router.get('/:number', async (req, res) => {
  try {
    const table = await prisma.table.findUnique({
      where: { tableNumber: req.params.number },
    });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching table' });
  }
});

// Admin only: Get all tables, CRUD tables
router.get('/', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const tables = await prisma.table.findMany({ orderBy: { tableNumber: 'asc' } });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tables' });
  }
});

router.post('/', authenticate, authorize(['ADMIN']), async (req, res) => {
  const { tableNumber } = req.body;
  try {
    const table = await prisma.table.create({
      data: {
        tableNumber,
        qrCode: `http://172.20.10.2:5174/table/${tableNumber}`,
      },
    });
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: 'Error creating table' });
  }
});

module.exports = router;
