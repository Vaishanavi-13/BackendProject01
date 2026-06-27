import {Router} from "express";
import {upload} from "../middlewares/multer.middlewares.js";
import { register,loginUser,logoutUser,refreshAccess} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


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

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refreshToken").post(refreshAccess);

export default router;