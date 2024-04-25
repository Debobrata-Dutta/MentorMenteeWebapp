const mongoose=require("mongoose")
const SignUp_info=mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        require:true
    },
    type: {
        type: String,
        default: "student"
    }
})

const Signup=new mongoose.model("SignUp_info",SignUp_info)
module.exports=Signup
