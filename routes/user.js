const router  = require('express').Router();
const userController = require('../controllers/users');
const middleware = require('../middlewares/auth');
const validator = require('../validators/validator');

// Get routes
router.get('/get',middleware.authenticateToken,userController.getProfile);
router.get('/verify-token',middleware.authenticateToken,userController.veryfyToken);

// Post routes
router.post('/signup',[validator.signup],userController.signup);
router.post('/authenticate',[validator.authenticate],userController.authenticate);
router.post('/update',middleware.authenticateToken,userController.updateProfile);

module.exports = router;