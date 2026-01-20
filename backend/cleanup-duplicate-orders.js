const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('./models/Order.model');

async function cleanupDuplicateOrders() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all pending orders
    const pendingOrders = await Order.find({ paymentStatus: 'pending' }).sort({ createdAt: -1 });
    console.log(`\n📋 Found ${pendingOrders.length} pending orders`);

    if (pendingOrders.length === 0) {
      console.log('✨ No pending orders to clean up!');
      process.exit(0);
    }

    console.log('\n🔍 Analyzing orders...\n');

    let deletedCount = 0;
    const ordersToDelete = [];

    // Check each pending order
    for (const pendingOrder of pendingOrders) {
      // Find if there's a paid order with same user, same total, created around the same time
      const paidOrder = await Order.findOne({
        user: pendingOrder.user,
        totalAmount: pendingOrder.totalAmount,
        paymentStatus: 'paid',
        createdAt: {
          $gte: new Date(pendingOrder.createdAt.getTime() - 60000), // Within 1 minute before
          $lte: new Date(pendingOrder.createdAt.getTime() + 60000)  // Within 1 minute after
        }
      });

      if (paidOrder) {
        console.log(`🗑️  Duplicate found:`);
        console.log(`   Pending: ${pendingOrder._id} - $${pendingOrder.totalAmount} - ${pendingOrder.createdAt}`);
        console.log(`   Paid:    ${paidOrder._id} - $${paidOrder.totalAmount} - ${paidOrder.createdAt}`);
        ordersToDelete.push(pendingOrder._id);
      }
    }

    if (ordersToDelete.length === 0) {
      console.log('✨ No duplicate pending orders found!');
    } else {
      console.log(`\n⚠️  Found ${ordersToDelete.length} duplicate pending orders to delete`);
      console.log('\nDo you want to delete these? (This script will auto-delete in 5 seconds)');
      console.log('Press Ctrl+C to cancel\n');

      // Wait 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Delete duplicate orders
      const result = await Order.deleteMany({ _id: { $in: ordersToDelete } });
      deletedCount = result.deletedCount;

      console.log(`\n✅ Deleted ${deletedCount} duplicate pending orders`);
    }

    // Show remaining orders
    const remainingOrders = await Order.find().sort({ createdAt: -1 }).populate('user', 'username email');
    console.log(`\n📊 Remaining orders: ${remainingOrders.length}`);
    console.log('\nFinal order list:');
    remainingOrders.forEach(order => {
      console.log(`   ${order._id} - ${order.paymentStatus.toUpperCase().padEnd(8)} - $${order.totalAmount} - ${order.createdAt.toLocaleDateString()}`);
    });

    console.log('\n✨ Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanupDuplicateOrders();
