const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка создания категории' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения списка' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, { where: { id: req.params.id } });
    updated ? res.json(await Category.findByPk(req.params.id)) : res.status(404).json({ error: 'Не найдено' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: 'Удалено' }) : res.status(404).json({ error: 'Не найдено' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
};
