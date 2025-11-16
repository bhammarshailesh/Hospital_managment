const Hospital = require("../models/hospitalModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const generateId = require("../utils/generateId");



exports.registerHospital = async (req, res) => {
    const data = req.body;

    // Generate Hospital ID
    data.hospital_id = generateId();


    // Save uploaded file
    data.hospital_logo = req.file ? req.file.filename : null;

    try {
        // Hash password (IMPORTANT)
        data.password = await bcrypt.hash(data.password, 10);
    } catch (err) {
        return res.status(500).json({ message: "Password hashing failed", error: err });
    }

    Hospital.checkExisting(data, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });

        if (result.length > 0) {
            let exist = result[0];

            if (data.registration_no && exist.registration_no === data.registration_no) {
                return res.status(400).json({ message: "Hospital with this Registration Number already exists!" });
            }

            if (data.provision_no && exist.provision_no === data.provision_no) {
                return res.status(400).json({ message: "Hospital with this Provision Number already exists!" });
            }
            if (data.email && exist.email === data.email) {
                return res.status(400).json({ message: "Hospital with this email already exists!" });
            }


        }

        Hospital.create(data, (err2) => {
            if (err2) return res.status(500).json({ message: "Insert error", error: err2 });

            res.status(200).json({
                message: "Hospital registered successfully!",
                data
            });
        });
    });
};

// exports.loginHospital = (req, res) => {
//     const { hospital_id, password } = req.body;

//     if (!hospital_id || !password) {
//         return res.status(400).json({
//             message: "Hospital ID and password are required"
//         });
//     }

//     const sql = `
//         SELECT * FROM hospitals 
//         WHERE hospital_id = ?
//         LIMIT 1
//     `;

//     db.query(sql, [hospital_id], async (err, result) => {
//         if (err) return res.status(500).json({ message: "DB error", error: err });

//         if (result.length === 0) {
//             return res.status(404).json({ message: "Invalid Hospital ID" });
//         }

//         const hospital = result[0];

//         // Check Password
//         const match = await bcrypt.compare(password, hospital.password);
//         if (!match) {
//             return res.status(400).json({ message: "Wrong password" });
//         }

//         // Create JWT Token
//         const token = jwt.sign(
//             {
//                 hospital_id: hospital.hospital_id,
//                 hospital_name: hospital.hospital_name
//             },
//             "YOUR_SECRET_KEY", // Replace with your real secret key
//             { expiresIn: "1d" } // Token valid for 1 day
//         );

//         res.status(200).json({
//             message: "Login successful",
//             token: token,
//             expires_in: "1 day",
//             hospital_id: hospital.hospital_id,
//             hospital_name: hospital.hospital_name
//         });
//     });
// };
exports.loginHospital = (req, res) => {
    const { hospital_id, password } = req.body;

    if (!hospital_id || !password) {
        return res.status(400).json({
            message: "Hospital ID and password are required"
        });
    }

    const sql = `
        SELECT * FROM hospitals 
        WHERE hospital_id = ?
        AND status = 1
        LIMIT 1
    `;

    db.query(sql, [hospital_id], async (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });

        if (result.length === 0) {
            return res.status(404).json({
                message: "Hospital not found"
            });
        }

        const hospital = result[0];

        // Check Password
        const match = await bcrypt.compare(password, hospital.password);
        if (!match) {
            return res.status(400).json({ message: "Wrong Details" });
        }

        // Create JWT Token
        const token = jwt.sign(
            {
                hospital_id: hospital.hospital_id,
                hospital_name: hospital.hospital_name
            },
            "YOUR_SECRET_KEY",
            { expiresIn: "1d" }
        );

        // ⭐ Set token in cookie
        res.cookie("hospital-admin", token, {
            // httpOnly: true,
            // secure: false,   // change to true in production
            httpOnly: false,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            // token: token,
            hospital
        });
    });
};


exports.getAllHospitals = (req, res) => {
    Hospital.getAll((err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });

        res.status(200).json({
            message: "Active hospitals fetched successfully",
            hospitals: result
        });
    });
};


exports.deleteHospital = (req, res) => {
    const { hospital_id } = req.params;

    if (!hospital_id) {
        return res.status(400).json({ message: "Hospital ID required" });
    }

    Hospital.softDelete(hospital_id, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Hospital not found or already deleted" });
        }

        res.status(200).json({
            message: "Hospital deleted successfully (soft delete)"
        });
    });
};



