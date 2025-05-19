const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Price = sequelize.define('Price', {
  productId: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
}, {
  timestamps: true,
});

module.exports = Price;
