import mongoose from "mongoose";
const Schema = mongoose.Schema;

//create user account model class 
const UsersAccountSchema = new Schema({

    user_id:{
        type:String,
        required: true   
    },
    userName:{
        type: String,
        required: true
    },
    birthday:{
        type:String,
        required: true 
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    country:{
        type:String,
        required: true
    },
    gender:{
        type:String,
        required: true
    },
    tel_no:{
        type:String,
        required: true
    },
    badge:{
        type:String,
        required: true
    },
    imageName:{
        data:Buffer,
        contentType:String
    },
    post_count:{
        type: String
    }
},{timestamps:true})


export default mongoose.model("user_accounts",UsersAccountSchema);
