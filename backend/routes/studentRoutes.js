const express = require("express");
const router = express.Router();
const {
  createStudent,
  getStudents,
  notifyParent,
  deleteStudent,

} = require("../controllers/studentController");


router.post("/", createStudent);
router.get("/", getStudents);
router.post("/:id/notify", notifyParent);
router.delete("/:id", deleteStudent);

module.exports = router;
