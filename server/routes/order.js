const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Create Order (Customer)
router.post('/', async (req, res) => {
  const { tableId, items, paymentMethod, totalAmount } = req.body;

  try {
    const orderNumber = `ORD-${Date.now()}`;
    const orderStatus = paymentMethod === 'CASH' ? 'WAITING_CASHIER_PAYMENT' : 'WAITING_PAYMENT';
    const paymentStatus = paymentMethod === 'CASH' ? 'CASH_WAITING_CONFIRMATION' : 'UNPAID';

    const order = await prisma.order.create({
      data: {
        orderNumber,
        tableId,
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        totalAmount,
        paymentMethod,
        orderStatus,
        paymentStatus,
        items: {
          create: items.map(item => ({
            menuId: item.menuId,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes
          }))
        },
        logs: {
          create: { status: orderStatus }
        }
      },
      include: {
        items: { include: { menu: true } },
        table: true
      }
    });

    // Notify Cashier
    req.io.emit('new-order', order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Update Order Status (Cashier/Kitchen)
router.put('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: status,
        logs: { create: { status } }
      },
      include: { table: true, items: { include: { menu: true } } }
    });

    // Notify relevant parties
    req.io.emit('order-updated', updatedOrder);
    req.io.to(`order-${orderId}`).emit('status-changed', updatedOrder);

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
});

// Confirm Cash Payment (Cashier)
router.put('/:id/confirm-cash', authenticate, authorize(['CASHIER', 'ADMIN']), async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        paymentStatus: 'PAID',
        orderStatus: 'PAID',
        logs: { create: { status: 'PAID' } }
      },
      include: { table: true, items: { include: { menu: true } } }
    });

    req.io.emit('order-updated', order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error confirming payment' });
  }
});

// Get Order by Number (Customer/Public)
router.get('/number/:orderNumber', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      include: {
        items: { include: { menu: true } },
        table: true,
        logs: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Get Orders for Dashboard (Staff)
router.get('/staff', authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { table: true, items: { include: { menu: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;
