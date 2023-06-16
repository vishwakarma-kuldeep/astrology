const router  = require('express').Router();
const userController = require('../controllers/users');
const middleware = require('../middlewares/auth');
const { checkProduct } = require('../middlewares/product');
const validator = require('../validators/validator');
const {checkAdmin} = require("../middlewares/adminmiddleware");
// Get routes
router.get('/get',middleware.authenticateToken,userController.getProfile);
router.get('/verify-token',middleware.authenticateToken,userController.veryfyToken);

// Post routes
router.post('/signup',[validator.signup],userController.signup);
router.post('/authenticate',[validator.authenticate],userController.authenticate);
router.post('/update',middleware.authenticateToken,userController.updateProfile);

// Add product to wishlist
router.post('/add-to-wishlist',[middleware.authenticateToken,checkProduct],userController.addToWishlist);
// remove product from wishlist
router.post('/remove-from-wishlist',[middleware.authenticateToken,checkProduct],userController.removeFromWishlist);
// Get wishlist
router.get('/get-wishlist',middleware.authenticateToken,userController.getWishlist);



// Admin routes
router.get('/get-all',[middleware.authenticateToken,checkAdmin],userController.getAllUsers);
router.post('/delete/:id',[middleware.authenticateToken,checkAdmin],userController.deleteUser);
module.exports = router;