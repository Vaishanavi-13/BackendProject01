import {Router} from "express";
import register from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: 'avatar', //this name should be same as the name attribute of the file input field in frontend form
            maxCount: 1
        },
        {
            name : 'coverImage',//this name should be same as the name attribute of the file input field in frontend form
            maxCount: 1
        }
    ]),register);

export default router;