import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js"
import apiResponse from "../utils/apiResponse.js"

const register = asyncHandler(async (req,res) =>{
        //steps:
        //1.get data of user from a frontend
        //2.validate the data
        //3.Check user already exists or not
        //4.if not then create new user and check for images , check for avatar
        //5.create user object - create a document in database
        //6. remove password and refresh Token from the response
        //return the response to frontend


        //1.get data of user from a frontend

        const {username, email, fullname, password} = req.body;
        console.log(req.body);

        if(
            [username,email,fullname,password].some((fields)=>
                field ?.trim() === "")
        ){
            throw new apiError(400, "All fields are required");
        }

        const exitedUser = User.findone({ 
            $or : [{ email }, { username}]
        })

        if(exitedUser) {
            throw new apiError(409, "This username or mail already exists")
        }

         const avatarLocaleFilePath = req.files?.avatar[0]?.path;
         const coverImageLocalFilePath = req.files?.coverImage[0]?.path;

        if(!avatarLocaleFilePath) throw new apiError(400, "Avatar is required");

        const avatar = await uploadOnCloudinary(avatarLocaleFilePath);
        const coverImage = await uploadOnCloudinary(coverImageLocalFilePath);

        if(!avatar) throw new apiError(400, "Avatar is required");

        const userCretionInDB = await User.create({
            username: username.toLowerCase(),
            fullname,
            avatar: avatar.url,
            coverImage : coverImage?.url || "",
            email,
            password
        })

        const chechUser = await User.findById(_id).select(
            "-password -refreshToken" 
        )

        if(!chechUser) throw new apiError(500, "Something Went wrong while registring a user")
        
})

export default register;