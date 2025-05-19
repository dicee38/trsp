const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Brand = sequelize.define('Brand', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  timestamps: true,
});

module.exports = Brand;
