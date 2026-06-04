import asyncHandler from "../utils/asyncHandler.js";

const register = asyncHandler(async (req,res) =>{
        res.status(200).json({
            success: true,
            message: "Register route"
        })
})

export default register;