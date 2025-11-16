
const db = require("../config/db");

const Hospital = {

    checkExisting: (data, callback) => {
    const sql = `
        SELECT * FROM hospitals 
        WHERE status = 1
        AND (
            registration_no = ?
            OR provision_no = ?
            OR email = ?
        )
    `;

    db.query(sql, [
        data.registration_no,
        data.provision_no,
        data.email
    ], callback);
},

    create: (data, callback) => {
        const sql = `
        INSERT INTO hospitals 
        (hospital_id, hospital_name, registration_no, provision_no, hospital_type, owner_name, 
        address, city, district, state, country, mobile, alt_mobile, email, password, hospital_logo, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        db.query(sql, [
            data.hospital_id,
            data.hospital_name,
            data.registration_no,
            data.provision_no,
            data.hospital_type,
            data.owner_name,
            data.address,
            data.city,
            data.district,
            data.state,
            data.country,
            data.mobile,
            data.alt_mobile,
            data.email,
            data.password,
            data.hospital_logo,
            1 // status
        ], callback);
    }
    ,

    getAll: (callback) => {
        const sql = `
            SELECT * FROM hospitals 
            WHERE status = 1
            ORDER BY id DESC
        `;
        db.query(sql, callback);
    },

    softDelete: (hospital_id, callback) => {
        const sql = `
            UPDATE hospitals
            SET status = 2
            WHERE hospital_id = ?
        `;
        db.query(sql, [hospital_id], callback);
    }

};

module.exports = Hospital;
