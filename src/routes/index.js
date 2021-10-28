const express = require("express");

const router = express.Router();

// Controller

// import controller function here
const { showhome} = require("../controllers/home")
// Route
router.get("/home", showhome);


// add route here

module.exports = router;
