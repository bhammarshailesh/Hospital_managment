const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors")
const cookieParser = require("cookie-parser");



app.use(express.json());
app.use(cookieParser());
const hello = ["http://localhost:3001", "http://localhost:3000"];

const corsOptions = {
    origin: function (origin, callback) {
        if (hello.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
http://localhost:5000/uploads/hospital_logo/hospital_1763215349606.jfif
app.use("/uploads", express.static("uploads"));

const hospitalRoutes = require("./routes/routes");
app.use("/api/hospitals", hospitalRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
