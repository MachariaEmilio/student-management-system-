const express = require("express");
const router = express.Router();
const {
  createStudent,
  getStudents,
  notifyParent,
  deleteStudent,
  sendOtp,
  verifyOtp,

} = require("../controllers/studentController");


router.post("/", createStudent);
router.get("/", getStudents);
router.post("/:id/notify", notifyParent);
router.delete("/:id", deleteStudent);
router.post("/send", sendOtp); 
router.post("/verify", verifyOtp); 
module.exports = router;
