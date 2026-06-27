const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', categoryController.getAllCategories);
router.post('/', verifyToken, requireAdmin, categoryController.createCategory);

module.exports = router;
