const Feedback = require('../controllers/feedback');
const Faq = require('../controllers/faq')
const newFeature    = require('../controllers/newFeature');
const { authenticateToken } = require('../middlewares/auth');
const { sendGetInTouchMessage } = require('../controllers/getInTouch');
const { checkAdmin } = require('../middlewares/adminmiddleware');
const router = require('express').Router();

router.post('/create',[authenticateToken,checkAdmin],Feedback.createFeedback);
router.post('/give-feedback/:id',[authenticateToken],Feedback.updateFeedback);
router.get('/get-all-feedback-ques',[authenticateToken],Feedback.getFeedbacks);

// Faqs

router.post('/create',[authenticateToken,checkAdmin],Faq.createFaq);
router.get('/get-all-faqs',[authenticateToken],Faq.getFaqs);
router.post('/update/:id',[authenticateToken,checkAdmin],Faq.updateFaq);


// upcoming features
router.post('/create',[authenticateToken,checkAdmin],newFeature.createFeature);
router.post('/update/:id',[authenticateToken,checkAdmin],newFeature.updateFeature);
router.get('/new-features',[authenticateToken],newFeature.getFeatures);

// About Us
router.get('/about-us',[authenticateToken],newFeature.getAboutUs);
router.post('/create-about-us',[authenticateToken,checkAdmin],newFeature.addAboutUs);
router.post('/update-about-us/:id',[authenticateToken,checkAdmin],newFeature.updateAboutUs);



// Get In Touch
router.post('/send-message',[authenticateToken],sendGetInTouchMessage);
module.exports = router;