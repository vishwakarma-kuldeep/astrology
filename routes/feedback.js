const Feedback = require('../controllers/feedback');
const Faq = require('../controllers/faq')
const { authenticateToken } = require('../middlewares/auth');


const router = require('express').Router();

router.post('/create',[authenticateToken],Feedback.createFeedback);
router.post('/give-feedback/:id',[authenticateToken],Feedback.updateFeedback);
router.get('/get-all-feedback-ques',[authenticateToken],Feedback.getFeedbacks);

// Faqs

router.post('/create',[authenticateToken],Faq.createFaq);
router.get('/get-all-faqs',[authenticateToken],Faq.getFaqs);
router.post('/update/:id',[authenticateToken],Faq.updateFaq);

module.exports = router;