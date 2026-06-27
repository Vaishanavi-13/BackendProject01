import mongoose from "mongoose"
import {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type : String,
            requiresd : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true  //For faster search of username in database
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        fullname: {
            type:String,
            required : true,
            trim : true,
            index : true
        },
        avatar: {
            type : String, //Claudinary URL of the image
            requored : true
        
        },
        coverImage: {
            type : String, //Claudinary URL of the image
        },
        watchHistory: {
            type: Schema.Types.ObjectId,
            ref : "Video"
        },
        password : {
            type : String,
            required : [true, "Password is required"],
            minlength : [6, "Password must be at least 6 characters long"]
        },
        refreshToken : {
            type : String,
        }
    
    },{timestamps : true}
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return
        //if password is not modified then move to next middleware;

    this.password = await bcrypt.hash(this.password, 10)

   

})

//custom mrthods

userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email,
            fullname : this.fullname
        }
        ,process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }   
    )
}

export const User = mongoose.model("User" , userSchema)