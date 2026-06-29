import {Router} from "express";
import {upload} from "../middlewares/multer.middlewares.js";
import { register,loginUser,logoutUser,refreshAccess,changeCurrentPassword,updateUserAccount,updateAvatar,updateCoverImage,getChannelProfile,getWatchHistory } from "../controllers/user.controller.js";
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

router.route("/change-Password").put(verifyJWT, changeCurrentPassword);

router.route("/account").patch(verifyJWT, updateUserAccount);

router.route("/avatar").patch(verifyJWT,upload.single('avatar'), updateAvatar);

router.route("/coverImage").patch(verifyJWT, upload.single('coverImage'),updateCoverImage);

router.route("/c/:username").get(verifyJWT, getChannelProfile);

router.route("/get-Watch-History").get(verifyJWT, getWatchHistory);

// router.stack.forEach((layer) => {
//     if (layer.route) {
//         console.log(layer.route.path, Object.keys(layer.route.methods));
//     }
// });

export default router;