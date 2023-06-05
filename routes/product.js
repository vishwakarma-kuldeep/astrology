const productController = require('../controllers/product');
const middleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/adminmiddleware');
const product = require('../middlewares/product')
const router = require('express').Router();


router.post('/add', [middleware.authenticateToken, adminMiddleware.checkAdmin], productController.addProduct);
router.post('/update/:id', [middleware.authenticateToken, adminMiddleware.checkAdmin], productController.updateProduct);
router.post('/add-image/:id', [middleware.authenticateToken, adminMiddleware.checkAdmin], productController.addImage);
router.post('/add-discount/:id', [middleware.authenticateToken, adminMiddleware.checkAdmin,product.checkProduct], productController.addDiscount);
router.get('/get-all', [middleware.authenticateToken], productController.getAllProducts);
router.get('/get/:id', [middleware.authenticateToken,product.checkProduct], productController.getProductById);

// Get Products by category
router.get('/get-by-category/:id', [middleware.authenticateToken,product.checkCategory], productController.getProductsByCategory);
// Get Products by subcategory
router.get('/get-by-subcategory/:id', [middleware.authenticateToken,product.checkSubCategory], productController.getProductsBySubCategory);
module.exports = router;