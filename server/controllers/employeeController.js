const User = require('../models/User');

const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).sort('-createdAt').lean();
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { employeeId, name, password, phone, email } = req.body;
    const exists = await User.findOne({ employeeId: employeeId?.toUpperCase() });
    if (exists) return res.status(409).json({ success: false, message: 'Employee ID already exists.' });
    const user = await User.create({ employeeId, name, password, phone, email, role: 'employee', createdBy: req.user._id });
    res.status(201).json({ success: true, message: `Employee ${user.name} created!`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleEmployeeStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Employee not found.' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: `Employee ${user.isActive ? 'activated' : 'deactivated'}.`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resetEmployeePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Employee not found.' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: `Password reset for ${user.name}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEmployees, createEmployee, toggleEmployeeStatus, resetEmployeePassword };
