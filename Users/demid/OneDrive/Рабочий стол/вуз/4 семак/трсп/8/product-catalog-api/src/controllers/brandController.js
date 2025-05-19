const Brand = require('../models/Brand');

exports.createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка создания бренда' });
  }
};

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения списка' });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const [updated] = await Brand.update(req.body, { where: { id: req.params.id } });
    updated ? res.json(await Brand.findByPk(req.params.id)) : res.status(404).json({ error: 'Не найдено' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления' });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const deleted = await Brand.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: 'Удалено' }) : res.status(404).json({ error: 'Не найдено' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
};
