const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountSchema = new Schema({
    accountNumber: {
        type: Number,
        required: false,
    },
    accountType: {
        type: String,
        default: ['saving', 'current'],
        required: false,
    },
    Name:{
        type: String,
        required: false,
    },
    S_O_Name:{
        type:String,
        required:false,
    },
    Address: {
        type: String,
        required: false,
    },
    // aadharNo: {
    //     type: Number,
    //     required: true,
    // },

    mobileNo: {
        type: Number,
        required: false,
    },
    PanNo:{
        type:Number,
        required:false,
    },
    SchemeType:{
        type:String,
        required:false,
    },
    PlanName:{
        type:Number,
        required:false,
    },
    CustomerId:{
        type:String,
        required:false,
    },
    OpeningDate:{
        type:Date,
        required:false,
    },
    InsatllmentAmount:{
        type:Number,
        required:false,
    },
    Period:{
        type:Number,
        required:false,
    },
    PeriodInterest:{
        type:Number,
        required:false,
    },
    DepositAmount:{
        type:Number,
        required:false,
    },
    DepositInterest:{
        type:Number,
        required:false,
    },
    Maturity:{
        type:Date,
        required:false,
    },
    MaturityAmount:{
        type:Number,
        required:false,
    },
     OpeningBalance: {
        type: Number,
        required: false,
    },
    ClosingBalance:{
        type: Number,
        required: false,
    },
    Action:{
        
    }

}, { timestamps: true });

module.exports = mongoose.model("AccountCreate", accountSchema);
