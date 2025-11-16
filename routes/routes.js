const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadHospitalFile");
const hospitalController = require("../controllers/hospitalController");

// POST → /api/hospital/register
router.post("/register", upload.single("hospital_logo"), hospitalController.registerHospital);

router.post("/login", hospitalController.loginHospital);
router.get("/all", hospitalController.getAllHospitals);
router.delete("/delete/:hospital_id", hospitalController.deleteHospital);
// router.post("/logout", hospitalController.logoutHospital);



// const upload = require("../middleware/uploadDoctor");
// const doctorController = require("../controllers/doctorController");


// router.post("/doctor/register", upload.single("profile_photo"), doctorController.registerDoctor);
// router.post("/doctor/login", doctorController.loginDoctor);
// router.get("/doctor/all/:hospital_id", doctorController.getDoctorsByHospital);
// router.delete("/doctor/delete/:doctor_id", doctorController.deleteDoctor);
// router.put("/doctor/update", upload.single("profile_photo"), doctorController.updateDoctor);




module.exports = router;
