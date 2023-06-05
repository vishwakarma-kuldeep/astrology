const Plan = require ('../controllers/plans');
const { checkPlan } = require('../middlewares/plan');
const { authenticateToken } = require('../middlewares/auth');
const { checkAdmin } = require('../middlewares/adminmiddleware');
const router = require('express').Router();

router.post('/create',[authenticateToken,checkAdmin,checkPlan],Plan.createPlan);
router.get('/get',[authenticateToken],Plan.getPlans);

module.exports = router;