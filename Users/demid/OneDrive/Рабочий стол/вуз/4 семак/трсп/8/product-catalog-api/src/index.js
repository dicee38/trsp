const express = require('express');
require('dotenv').config();
const { sequelize } = require('./models');

// Импорт роутов
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const priceRoutes = require('./routes/priceRoutes');

const app = express();
app.use(express.json());

// Статус сервера
app.get('/health', (req, res) => res.send('API работает 🚀'));

// Роуты
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/brands', brandRoutes);
app.use('/prices', priceRoutes);

// Запуск
const start = async () => {
  try {
    await sequelize.sync({ alter: true }); // синхронизация без потери данных
    app.listen(3000, () => console.log('Сервер запущен на http://localhost:3000'));
  } catch (err) {
    console.error('Ошибка запуска сервера:', err);
  }
};

start();
