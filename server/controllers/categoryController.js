const Category = require('../models/Category');
const Catalog = require('../models/Catalog');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('sortOrder name').lean();
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Catalog.countDocuments({ category: cat._id, isActive: true });
        return { ...cat, productCount: count };
      })
    );
    res.json({ success: true, data: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, message: 'Category created!', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const count = await Catalog.countDocuments({ category: req.params.id, isActive: true });
    if (count > 0) {
      return res.status(400).json({ success: false, message: `Cannot delete: ${count} products exist in this category.` });
    }
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
