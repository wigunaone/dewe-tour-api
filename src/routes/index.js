const express = require("express");
const { showhome } = require("../controllers/home");

const router = express.Router();

// Controller

const {getUsers, deleteUser } = require("../controllers/user");
const {register,login} = require("../controllers/auth");
// import controller function here
const {addCountry, getCountries, getCountry, updateCountry, deleteCountry} = require("../controllers/country");
// Route
const {auth,adminOnly} = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
// router.post("/user", addUsers);
router.get("/users",auth,adminOnly, getUsers);
// router.get("/user/:id", getUser);
// router.patch("/user/:id", updateUser);
router.delete("/user/:id",auth, adminOnly, deleteUser);


router.post("/country",auth,adminOnly, addCountry);
router.get("/countries", getCountries);
router.get("/country/:id", getCountry);
router.patch("/country/:id",auth,adminOnly, updateCountry);
router.delete("/country/:id",auth,adminOnly, deleteCountry);




// add route here

module.exports = router;
