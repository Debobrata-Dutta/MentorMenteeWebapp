const mongoose = require("mongoose");
const Registration_Form =mongoose.Schema({
    firstName:{
        type:String,
        required:false
    },
    lastName:{
        type:String,
        required:false
    },
    rollNo:{
        type:String,
        required:false
    },
    course:{
        type:String,
        required:false
    },
    gender:{
        type:String,
        required:false
    },
    dob:{
        type:String,
        required:false
    },
    batch:{
        type:String,
        required:false
    },
    section:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    phone:{
        type:String,
        required:false,
        // validate: {
        //     validator: function(v) {
        //         var re = /^\d{10}$/;
        //         return (!v || !v.trim().length) || re.test(v)
        //     },
        //     message: 'Provided phone number is invalid.'
        // }
    },
    address:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false
    },
    fatherName:{
        type:String,
        required:false},
    motherName:{
        type:String,
        required:false},
    fatherOccupation:{
        type:String,
        required:false},
    motherOccupation:{
        type:String,
        required:false
    },
    fatherEmail:{
        type:String,
        required:false},
    fatherPhone:{
        type:String,
        required:false,
        // validate: {
        //     validator: function(v) {
        //         var re = /^\d{10}$/;
        //         return (!v || !v.trim().length) || re.test(v)
        //     },
        //     message: 'Provided phone number is invalid.'
        // }
    },
    motherEmail:{
        type:String,
        required:false
    },
    motherPhone:{
        type:String,
        required:false,
        // validate: {
        //     validator: function(v) {
        //         var re = /^\d{10}$/;
        //         return (!v || !v.trim().length) || re.test(v)
        //     },
        //     message: 'Provided phone number is invalid.'}
    },
    class10Percentage:{
        type:String,
        required:false},
    class12Percentage:{
        type:String,
        required:false},
    date:{
        type:String,
        required:false
    },
    comments:{
        type:String,
        required:false}
})
const registration=new mongoose.model("Registration_Form",Registration_Form)
module.exports=registration