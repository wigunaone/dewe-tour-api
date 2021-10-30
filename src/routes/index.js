const express = require("express");
const { showhome } = require("../controllers/home");

const router = express.Router();

// Controller

const { addUsers, getUsers, getUser, updateUser, deleteUser } = require("../controllers/user");
const {register} = require("../controllers/auth");
// import controller function here
const {addCountry, getCountries, getCountry, updateCountry, deleteCountry} = require("../controllers/country");
// Route

router.post("/register", register);
// router.post("/login", login);
router.post("/user", addUsers);
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

router.post("/country", addCountry);
router.get("/countries", getCountries);
router.get("/country/:id", getCountry);
router.patch("/country/:id", updateCountry);
router.delete("/country/:id", deleteCountry);




// add route here

module.exports = router;
