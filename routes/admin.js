const router = require('express').Router();
const AdminController = require('../controllers/admin');
const validate = require('../validators/validator');
const middleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/adminmiddleware');

router.post('/sign-up', validate.validateEmail, AdminController.signup);
router.post('/auth',validate.validateEmail,  AdminController.authenticate);

module.exports = router;