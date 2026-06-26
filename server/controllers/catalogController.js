const Catalog = require('../models/Catalog');
const cloudinary = require('../config/cloudinary');

const getCatalogs = async (req, res) => {
  try {
    const { search, category, availability, featured, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const filter = { isActive: true };
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (availability) filter.availability = availability;
    if (featured === 'true') filter.isFeatured = true;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [catalogs, total] = await Promise.all([
      Catalog.find(filter).populate('category', 'name slug icon').populate('addedBy', 'name employeeId').sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Catalog.countDocuments(filter),
    ]);
    res.json({ success: true, data: catalogs, pagination: { current: parseInt(page), total: Math.ceil(total / parseInt(limit)), count: catalogs.length, totalItems: total } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCatalogById = async (req, res) => {
  try {
    const catalog = await Catalog.findById(req.params.id).populate('category', 'name slug icon').populate('addedBy', 'name employeeId');
    if (!catalog || !catalog.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    catalog.viewCount += 1;
    await catalog.save();
    res.json({ success: true, data: catalog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCatalog = async (req, res) => {
  try {
    const catalogData = { ...req.body, addedBy: req.user._id };
    if (req.files && req.files.length > 0) {
      catalogData.images = req.files.map((file, index) => ({ url: file.path, publicId: file.filename, isPrimary: index === 0 }));
    }
    if (typeof catalogData.pricing === 'string') catalogData.pricing = JSON.parse(catalogData.pricing);
    if (typeof catalogData.colors === 'string') catalogData.colors = JSON.parse(catalogData.colors);
    if (typeof catalogData.materials === 'string') catalogData.materials = JSON.parse(catalogData.materials);
    if (typeof catalogData.dimensions === 'string') catalogData.dimensions = JSON.parse(catalogData.dimensions);
    const catalog = await Catalog.create(catalogData);
    await catalog.populate('category', 'name slug icon');
    res.status(201).json({ success: true, message: 'Product added to catalog successfully!', data: catalog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCatalog = async (req, res) => {
  try {
    const catalog = await Catalog.findById(req.params.id);
    if (!catalog) return res.status(404).json({ success: false, message: 'Product not found.' });
    const updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({ url: file.path, publicId: file.filename, isPrimary: catalog.images.length === 0 && index === 0 }));
      updateData.images = [...catalog.images, ...newImages];
    }
    const updated = await Catalog.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true, runValidators: true }).populate('category', 'name slug icon');
    res.json({ success: true, message: 'Product updated successfully!', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCatalogImage = async (req, res) => {
  try {
    const catalog = await Catalog.findById(req.params.id);
    if (!catalog) return res.status(404).json({ success: false, message: 'Product not found.' });
    await cloudinary.uploader.destroy(req.params.publicId);
    catalog.images = catalog.images.filter(img => img.publicId !== req.params.publicId);
    await catalog.save();
    res.json({ success: true, message: 'Image deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCatalog = async (req, res) => {
  try {
    await Catalog.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Product removed from catalog.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeatured = async (req, res) => {
  try {
    const featured = await Catalog.find({ isFeatured: true, isActive: true }).populate('category', 'name slug').limit(8).lean();
    res.json({ success: true, data: featured });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCatalogs, getCatalogById, createCatalog, updateCatalog, deleteCatalog, deleteCatalogImage, getFeatured };
