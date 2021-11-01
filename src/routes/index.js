const express = require("express");
const { showhome } = require("../controllers/home");

const router = express.Router();

// Controller

const {register,login} = require("../controllers/auth");
const {getUsers, deleteUser } = require("../controllers/user");
const {addCountry, getCountries, getCountry, updateCountry, deleteCountry} = require("../controllers/country");
const {addTrip, getTrips, getTrip, updateTrip, deleteTrip} = require("../controllers/trip");
const { addTransaction,getTransactions,getTransaction,updateTransaction } = require("../controllers/transaction");
// 

const {auth,adminOnly} = require("../middlewares/auth");
const {uploadFile} = require("../middlewares/uploadFile");


router.post("/register", register);
router.post("/login", login);

//route user
// router.post("/user", addUsers);
router.get("/users",auth,adminOnly, getUsers);
// router.get("/user/:id", getUser);
// router.patch("/user/:id", updateUser);
router.delete("/user/:id",auth, adminOnly, deleteUser);

//route country
router.post("/country",auth,adminOnly, addCountry);
router.get("/countries", getCountries);
router.get("/country/:id", getCountry);
router.patch("/country/:id",auth,adminOnly, updateCountry);
router.delete("/country/:id",auth,adminOnly, deleteCountry);

//route trip
router.post("/trip",auth,adminOnly,uploadFile("photo"), addTrip)
router.get("/trips",auth,getTrips)
router.get("/trip/:id",auth,getTrip)
router.patch("/trip/:id",auth,adminOnly,uploadFile("photo"),updateTrip)
router.delete("/trip/:id",auth,adminOnly,deleteTrip)

//route transaction
router.post("/transaction",auth,uploadFile("attachment"), addTransaction);
router.get("/transactions", getTransactions);
router.get("/transaction/:id", getTransaction);
router.patch("/transaction/:id",auth,adminOnly,uploadFile("attachment"),updateTransaction);
module.exports = router;
