const Doctor = require("../models/doctorModel");
const bcrypt = require("bcrypt");
const generateId = require("../utils/generateId");

exports.registerDoctor = async (req, res) => {
    const data = req.body;

    if (!data.hospital_id || !data.name || !data.mobile || !data.email) {
        return res.status(400).json({ message: "Required fields missing" });
    }

    data.doctor_id = `DOC-${generateId()}`;
    data.profile_photo = req.file ? req.file.filename : null;
    data.password = await bcrypt.hash(data.password, 10);

    Doctor.checkExisting(data, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });

        if (result.length > 0) {
            let exist = result[0];

            if (exist.email === data.email) {
                return res.status(400).json({ message: "Email already exists!" });
            }
            if (exist.mobile === data.mobile && exist.hospital_id === data.hospital_id) {
                return res.status(400).json({ message: "Mobile already exists for this hospital!" });
            }
            if (exist.license_no === data.license_no && exist.hospital_id === data.hospital_id) {
                return res.status(400).json({ message: "License already exists for this hospital!" });
            }
        }

        Doctor.create(data, (err2) => {
            if (err2) return res.status(500).json({ message: "Insert error", error: err2 });

            res.status(200).json({
                message: "Doctor registered successfully!",
                doctor_id: data.doctor_id,
                profile_photo: data.profile_photo
            });
        });
    });
};

exports.loginDoctor = (req, res) => {
    const { doctor_id, password } = req.body;

    if (!doctor_id || !password) {
        return res.status(400).json({ message: "Doctor ID and password required" });
    }

    const sql = `
        SELECT * FROM doctors 
        WHERE doctor_id = ? AND status = 1
        LIMIT 1
    `;

    db.query(sql, [doctor_id], async (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        if (result.length === 0) {
            return res.status(404).json({ message: "Invalid Doctor ID" });
        }

        const doctor = result[0];

        const match = await bcrypt.compare(password, doctor.password);
        if (!match) {
            return res.status(400).json({ message: "Wrong password" });
        }

        res.status(200).json({
            message: "Login successful",
            doctor
        });
    });
};

exports.getDoctorsByHospital = (req, res) => {
    const { hospital_id } = req.params;

    Doctor.getAllByHospital(hospital_id, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });

        res.status(200).json({
            message: "Doctors loaded",
            doctors: result
        });
    });
};

exports.deleteDoctor = (req, res) => {
    const { doctor_id } = req.params;

    Doctor.delete(doctor_id, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });

        res.status(200).json({
            message: "Doctor deleted (soft delete)"
        });
    });
};

exports.updateDoctor = (req, res) => {
    const data = req.body;
    data.profile_photo = req.file ? req.file.filename : data.old_photo;

    Doctor.update(data, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });

        res.status(200).json({
            message: "Doctor updated successfully"
        });
    });
};
