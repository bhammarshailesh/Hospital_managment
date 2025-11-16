const multer = require("multer");
const fs = require("fs");
const path = require("path");

// 🔥 Folder paths
const hospitalFolder = path.join(__dirname, "../uploads/hospital_logo");
const doctorFolder = path.join(__dirname, "../uploads/doctor_profile");

// 🛠 Auto create folders
if (!fs.existsSync(hospitalFolder)) {
    fs.mkdirSync(hospitalFolder, { recursive: true });
}

if (!fs.existsSync(doctorFolder)) {
    fs.mkdirSync(doctorFolder, { recursive: true });
}

// ⭐ Dynamic storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // Check input field
        if (file.fieldname === "hospital_logo") {
            cb(null, hospitalFolder);
        }
        else if (file.fieldname === "profile_photo") {
            cb(null, doctorFolder);
        }
        else {
            cb(new Error("Invalid file field name"), null);
        }
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);

        let filename;
        if (file.fieldname === "hospital_logo") {
            filename = "hospital_" + Date.now() + ext;
        }
        else if (file.fieldname === "profile_photo") {
            filename = "doctor_" + Date.now() + ext;
        }

        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
