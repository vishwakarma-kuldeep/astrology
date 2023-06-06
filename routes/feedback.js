const Feedback = require('../controllers/feedback');
const Faq = require('../controllers/faq')
const newFeature    = require('../controllers/newFeature');
const { authenticateToken } = require('../middlewares/auth');
const { sendGetInTouchMessage } = require('../controllers/getInTouch');


const router = require('express').Router();

router.post('/create',[authenticateToken],Feedback.createFeedback);
router.post('/give-feedback/:id',[authenticateToken],Feedback.updateFeedback);
router.get('/get-all-feedback-ques',[authenticateToken],Feedback.getFeedbacks);

// Faqs

router.post('/create',[authenticateToken],Faq.createFaq);
router.get('/get-all-faqs',[authenticateToken],Faq.getFaqs);
router.post('/update/:id',[authenticateToken],Faq.updateFaq);


// upcoming features
router.post('/create',[authenticateToken],newFeature.createFeature);
router.get('/new-features',[authenticateToken],newFeature.getFeatures);

// About Us
router.get('/about-us',[authenticateToken],newFeature.getAboutUs);



// Get In Touch
router.post('/send-message',[authenticateToken],sendGetInTouchMessage);
module.exports = router;