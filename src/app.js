import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors(
    {
        origin: process.env.ORIGIN_URL,
        credentials: true
    }
));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));
app.use(express.static('public'));


app.use(cookieParser());//take a cookie from request header and parse it and add it to 
// req.cookies object so that we can access it in our request handlers



import userRoutes from "./routes/user.routes.js";

app.use("/api/v1/users", userRoutes);

export default app;