import mongoose, {Schema} from "mongoose"
import mongooseAggrigatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema({

    videoFile: {
        type : String,
        required : true
    },
    thumbnail : {
        type : String,
        required : true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title:{
        type : String,
        required : true,
        trim : true,
        index : true
    },
    description : {
        type : String,
        trim : true
    },
    duration:{
        type : Number, //Duration of the video in seconds
        required : true
    },
    views: {
        type : Number,
        default : 0
    },
    isPublished: {
        type : Boolean,
        default : true
    }
},{timestamps : true}
)

//plugin() is a Mongoose method.
// It adds the functionality of mongooseAggregatePaginate to videoSchema.

videoSchema.plugin(mongooseAggreagatePaginate)//attaching plugins to schema

export const video = mongoose.model("Video" ,videoSchema)