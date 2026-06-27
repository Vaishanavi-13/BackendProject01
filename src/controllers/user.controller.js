import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {uploadToCloudinary} from "../utils/cloudinary.js"
import apiResponse from "../utils/apiResponse.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const generateRefreshAndAccessToken = async(userId) =>{
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refereshToken = user.generateRefreshToken();

    user.refreshToken = refereshToken;
    await user.save({validateBeforeSave : false});

    return {accessToken, refereshToken};
}

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
            [username,email,fullname,password].some((field)=>
                field ?.trim() === "")
        ){
            throw new apiError(400, "All fields are required");
        }

        const exitedUser = await User.findOne({ 
            $or : [{ email }, { username}]
        })

        if(exitedUser) {
            throw new apiError(409, "This username or mail already exists")
        }

         const avatarLocalFilePath = req.files?.avatar[0]?.path;
         const coverImageLocalFilePath = req.files?.coverImage[0]?.path;

        if(!avatarLocalFilePath) throw new apiError(400, "Avatar is required");

        const avatar = await uploadToCloudinary(avatarLocalFilePath);
        const coverImage = await uploadToCloudinary(coverImageLocalFilePath);

        if(!avatar) throw new apiError(400, "Avatar is required");

        const userCretionInDB = await User.create({
            username: username.toLowerCase(),
            fullname,
            avatar: avatar.url,
            coverImage : coverImage?.url || "",
            email,
            password
        })

        const checkUser = await User.findById(userCretionInDB._id)
    .select("-password -refreshToken");

        if(!checkUser) throw new apiError(500, "Something Went wrong while registring a user")

        return res.status(201).json(
            new apiResponse(
            201,
            checkUser,
            "User registered successfully"
        )      
    );
        
})


const loginUser = asyncHandler(async (req, res) => {


    // req body -> data
    // username, email
    // find user
    //password check
    // acess and refresh token generate
    // send cookie to frontend

    const {email, username, password} = req.body;

    if (!(email || username)) {
        throw new apiError(400, "Email or username is required");
    }

    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    if(!user) throw new apiError(404, "User not found");


    const isPasswordValid = await user.isPasswordMatch(password);

    if(!isPasswordValid) throw new apiError(401, "Invalid password");

    const {accessToken, refereshToken} = await generateRefreshAndAccessToken(user._id);

    const options = {
        httpOnly: true,
        secure: false
    }

    const loggedUser = await User.findById(user._id)
    .select("-password -refreshToken");


    return res
    .status(200)
    .cookie("refereshToken", refereshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
        {
            satuscode : 200,
            data : {
            user : loggedUser, accessToken, refereshToken
            },
            message: "User logged in successfully"
        }

    )

})

const logoutUser = asyncHandler(async (req, res) => {

        await User.findByIdAndUpdate(
            req.user._id,
            {
                refreshToken : undefined
            },
            {
                new : true
            }

        )

        const options = {
        httpOnly: true,
        secure: false
    }

    return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(
        {
            statuscode : 200,
            data : {},
            message: "User logged out successfully"
        }
    )

})

const refreshAccess = asyncHandler(async (req,res) =>{
    const incomingRefreshToken = await req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken) throw new apiError(401, "Unaithorised Access");

    try{

        const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if(incomingRefreshToken !== user.refreshToken) throw new apiError(401, "Invalid refresh token");

        const options = {
            httpOnly : true,
            secure : true
        }

        const {accessToken, newRefereshToken} = await generateRefreshAndAccessToken(user?._id);

        return res.status(200)
        .cookie("refreshToken", newRefereshToken, options) 
        .cookie("accessToken", accessToken, options)
        .json(
            {
                statuscode : 200,
                data : {
                    accessToken, refreshToken : newRefereshToken
                },

                message : "Access token refreshed successfully",
            }
        )


    }catch(error){
            throw new apiError(401, error ?. message || "Invalid Refresh Token")
    }
})

const changeCurrentPassword = asyncHandler(async (req,res) =>{
    const {oldPassword , newPassword} = req.body;

   const user = await User.findById(req.user._id);
   if(!user) throw new apiError(404, "User not found");

   const isPasswordCorrect = await isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect ) throw new apiError(401, "Old password is incorrect");

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new apiResponse({
            statuscode : 200,
        data : {
            user : user
        },
        message : "Password changed successfully" 
        })
    )

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json({
        statuscode : 200,
        data : {
            user : req.user
        },
        message : "Current user fetched successfully"
    })
})

const updateUserAccount = asyncHandler(async (req, res) => {
    
    const {fullname, email} = req.body

    if(!(fullname || email)) throw new apiError(400, "Fullname or email is required");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { fullname, email },
        { new: true }
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json({
        statuscode : 200,
        data : {
            fullname,
            email
        },
        message : "User account updated successfully"
    })
   
})

export {
    register,
    loginUser,
    logoutUser,
    refreshAccess,
    changeCurrentPassword,
    updateUserAccount
}