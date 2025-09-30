import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    name:{type :String ,required :true},
    dob:{ type: Date,required: true},
    personalId:{type:String,required: true},
    phoneno:{type:Number,required: true},
    email:{type :String ,unique:true ,required :true},
    password:{type :String ,required :true},
     watchlist: { type: [], default: [] },
},{minimize:false})

const userModel =mongoose.models.user || mongoose.model("User",userSchema);

export default userModel