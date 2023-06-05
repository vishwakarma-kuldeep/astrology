const Jyotis = require("../controllers/jyotis");
const auth = require("../middlewares/auth");
const Admin = require("../middlewares/adminmiddleware");
const jyotisMiddleware = require("../middlewares/jyotis");
// const jyotis = require('../models/jyotis');
const router = require("express").Router();

router.post(
  "/add-jyotis",
  [auth.authenticateToken, Admin.checkAdmin],
  Jyotis.addJyotis
);
router.post(
  "/update-jyotis/:id",
  [auth.authenticateToken, Admin.checkAdmin, jyotisMiddleware.checkJyotis],
  Jyotis.updateJyotis
);
router.get("/get-all-jyotis", Jyotis.getAllJyotis);
router.get("/get-jyotis/:id",[jyotisMiddleware.checkJyotis], Jyotis.getJyotis);
router.post("/update-timeslots/:id", [auth.authenticateToken, Admin.checkAdmin, jyotisMiddleware.checkJyotis], Jyotis.addTimeSlot);
router.post("/delete-jyotis/:id", [auth.authenticateToken, Admin.checkAdmin, jyotisMiddleware.checkJyotis], Jyotis.deleteJyotis);

module.exports = router;
