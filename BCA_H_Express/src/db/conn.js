const mongo_db=require("mongoose")
const e = require("express");
mongo_db.connect("mongodb://localhost:27017/Project_fsd").then(
    ()=>{
        console.log("connected")
    }
).catch(
    (e)=>{
        console.log(e)
    }
)