const db = require("../config/db");

const Doctor = {

    checkExisting: (data, callback) => {
        const sql = `
            SELECT * FROM doctors 
            WHERE status = 1
            AND (
                email = ?
                OR (mobile = ? AND hospital_id = ?)
                OR (license_no = ? AND hospital_id = ?)
            )
        `;

        db.query(sql, [
            data.email,
            data.mobile, data.hospital_id,
            data.license_no, data.hospital_id
        ], callback);
    },

    create: (data, callback) => {
        const sql = `
            INSERT INTO doctors (
                doctor_id, hospital_id, name, gender, mobile, email,
                address, education, specialization, experience, license_no,
                fee, visiting_hours, profile_photo, password, status
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)
        `;

        db.query(sql, [
            data.doctor_id,
            data.hospital_id,
            data.name,
            data.gender,
            data.mobile,
            data.email,
            data.address,
            data.education,
            data.specialization,
            data.experience,
            data.license_no,
            data.fee,
            data.visiting_hours,
            data.profile_photo,
            data.password,
        ], callback);
    },

    getAllByHospital: (hospital_id, callback) => {
        const sql = `
            SELECT * FROM doctors
            WHERE hospital_id = ? AND status = 1
        `;
        db.query(sql, [hospital_id], callback);
    },

    delete: (doctor_id, callback) => {
        const sql = `
            UPDATE doctors SET status = 2 WHERE doctor_id = ?
        `;
        db.query(sql, [doctor_id], callback);
    },

    update: (data, callback) => {

        const sql = `
            UPDATE doctors SET
                name = ?, gender = ?, mobile = ?, email = ?, address = ?,
                education = ?, specialization = ?, experience = ?, license_no = ?,
                fee = ?, visiting_hours = ?, profile_photo = ?
            WHERE doctor_id = ? AND hospital_id = ? AND status = 1
        `;

        db.query(sql, [
            data.name,
            data.gender,
            data.mobile,
            data.email,
            data.address,
            data.education,
            data.specialization,
            data.experience,
            data.license_no,
            data.fee,
            data.visiting_hours,
            data.profile_photo,
            data.doctor_id,
            data.hospital_id
        ], callback);
    }
};

module.exports = Doctor;
