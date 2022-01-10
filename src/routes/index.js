const express = require("express");
const { showhome } = require("../controllers/home");

const router = express.Router();

// Controller

const {register,login,checkAuth} = require("../controllers/auth");
const {getUsers,getUser, deleteUser,updateUser } = require("../controllers/user");
const {addCountry, getCountries, getCountry, updateCountry, deleteCountry} = require("../controllers/country");
const {addTrip, getTrips, getTrip, updateTrip, deleteTrip, searchTrip,getTripTransaction} = require("../controllers/trip");
const { addTransaction,getTransactions,getTransaction,updateTransaction, addTransaction2, getUserTransaction, updateStatus} = require("../controllers/transaction");
// 

const {auth,adminOnly} = require("../middlewares/auth");
const {uploadFile} = require("../middlewares/uploadFile");


router.post("/register", register);
router.post("/login", login);

router.get("/users",auth,adminOnly, getUsers);
router.get("/user",auth, getUser);
router.patch("/user",auth,uploadFile("photo"), updateUser);
router.delete("/user/:id",auth, adminOnly, deleteUser);

router.post("/country",auth,adminOnly, addCountry);
router.get("/countries", getCountries);
router.get("/country/:id", getCountry);
router.patch("/country/:id",auth,adminOnly, updateCountry);
router.delete("/country/:id",auth,adminOnly, deleteCountry);

//route trip
router.post("/trip",auth,adminOnly,uploadFile("photo"), addTrip)
router.get("/trips",getTrips);
router.get("/trip/:id",auth,getTrip)
router.patch("/trip/:id",auth,adminOnly,uploadFile("photo"),updateTrip)
router.delete("/trip/:id",auth,adminOnly,deleteTrip)
router.get("/search/:word",searchTrip)

//route transaction
router.post("/transaction",auth, addTransaction);//,uploadFile("attachment")
router.get("/transactions",auth, getTransactions);
router.get("/trips-transaction",auth, getTripTransaction);
router.get("/transaction/user",auth,getUserTransaction);
router.get("/transaction/:id", auth,getTransaction);
router.patch("/payment/:id",auth ,uploadFile("attachment"),updateTransaction);
router.patch("/update/:id", auth,adminOnly,updateStatus);
router.get("/checkAuth",auth,checkAuth);
module.exports = router;
