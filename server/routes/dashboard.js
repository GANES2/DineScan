const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/stats', authenticate, authorize(['ADMIN', 'CASHIER']), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, totalRevenue, pendingOrders, onlinePayments, cashPayments] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: today }, paymentStatus: 'PAID' },
        _sum: { totalAmount: true }
      }),
      prisma.order.count({ where: { orderStatus: { in: ['WAITING_PAYMENT', 'WAITING_CASHIER_PAYMENT'] } } }),
      prisma.order.count({ where: { paymentMethod: 'ONLINE', paymentStatus: 'PAID' } }),
      prisma.order.count({ where: { paymentMethod: 'CASH', paymentStatus: 'PAID' } })
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingOrders,
      onlinePayments,
      cashPayments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
