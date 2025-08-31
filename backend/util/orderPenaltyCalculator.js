const Order = require('../Models/OrderModel');

/**
 * Calculate penalty amount for uncollected orders
 * @param {string} userId - User ID
 * @param {string} canteenName - Canteen name
 * @returns {Object} - Object containing penalty amount and uncollected orders
 */
const calculateUncollectedPenalty = async (userId, canteenName) => {
  try {
    // Find uncollected orders for this user in this canteen with cash payment
    const uncollectedOrders = await Order.find({
      userId,
      canteenName,
      status: "uncollected",
      paymentMode: "cash"
    });

    if (uncollectedOrders.length === 0) {
      return {
        penaltyAmount: 0,
        uncollectedOrders: [],
        totalUncollectedAmount: 0
      };
    }

    // Calculate total uncollected amount
    const totalUncollectedAmount = uncollectedOrders.reduce((sum, order) => sum + order.price, 0);
    
    // Calculate 50% penalty
    const penaltyAmount = totalUncollectedAmount * 0.5;

    return {
      penaltyAmount,
      uncollectedOrders,
      totalUncollectedAmount
    };
  } catch (error) {
    console.error('Error calculating uncollected penalty:', error);
    return {
      penaltyAmount: 0,
      uncollectedOrders: [],
      totalUncollectedAmount: 0
    };
  }
};

/**
 * Update uncollected orders to fined status
 * @param {string} userId - User ID
 * @param {string} canteenName - Canteen name
 * @returns {boolean} - Success status
 */
const updateUncollectedToFined = async (userId, canteenName) => {
  try {
    const result = await Order.updateMany(
      {
        userId,
        canteenName,
        status: "uncollected",
        paymentMode: "cash"
      },
      {
        status: "fined"
      }
    );
    
    console.log(`Updated ${result.modifiedCount} uncollected orders to fined status for user ${userId} in canteen ${canteenName}`);
    return true;
  } catch (error) {
    console.error('Error updating uncollected orders to fined:', error);
    return false;
  }
};

module.exports = {
  calculateUncollectedPenalty,
  updateUncollectedToFined
};
