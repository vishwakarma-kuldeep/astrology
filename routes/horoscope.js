const Horoscope = require('../controllers/horoscope');
const {checkAdmin} = require('../middlewares/adminmiddleware');
const {authenticateToken} = require('../middlewares/auth');
const {checkHoroscopeCategory} = require('../middlewares/horoscope');
const router = require('express').Router();

router.post('/create-horoscope',[authenticateToken,checkAdmin],Horoscope.createHoroscope);

router.post('/create-horoscope-category',[authenticateToken,checkAdmin,checkHoroscopeCategory],Horoscope.createHoroscopeCategory);

router.get('/get',[authenticateToken],Horoscope.getHoroscope);
router.get('/get/:id',[authenticateToken],Horoscope.getHoroscopeById);
router.get('/get-horoscope-category',[authenticateToken],Horoscope.getHoroscopeCategory);
module.exports = router;