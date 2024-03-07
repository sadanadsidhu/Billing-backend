const  asyncHandler  = require ("../utils/asyncHandler.js");
const  ApiError  = require("../utils/ApiError.js");
const ApiResponse  =require ('../utils/ApiResponse.js')
const AccountCreate = require('../models/accountCreateModel');
const  Transaction  =require('../models/transcationModel.js')


const generatedBillNo = async () => {
    return await Transaction.generateBillNumber();
};

// const asyncHandler = (fn) => (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
const createAccount = asyncHandler(async (req, res) => {

    const { 
        accountNumber,
        accountType,
           Name,
           S_O_Name,
           Address, 
           mobileNo, 
           PanNo, 
           SchemeType,
           PlanName,
           CustomerId,
           OpeningDate,
           InsatllmentAmount,
           Period,
           PeriodInterest,
           DepositAmount,
           DepositInterest,
           Maturity,
           MaturityAmount,
           OpeningBalance,
           ClosingBalance 
        } = req.body

    const exsAcconnt = await AccountCreate.findOne({
        $or: [
            { accountNumber },
            { mobileNo }
        ]
    })


    // if (exsAcconnt) {
    //     throw new ApiError(409, "Account Number and phone number alradey exesis")
    // }

    const account = await AccountCreate.create({
        accountNumber,
        accountType,
        Name,
        S_O_Name,
        Address,
        mobileNo,
        PanNo,
        SchemeType,
        PlanName,
        CustomerId,
        OpeningDate,
        InsatllmentAmount,
        Period,
        PeriodInterest,
        DepositAmount,
        DepositInterest,
        Maturity,
        MaturityAmount,
        OpeningBalance,
        ClosingBalance,
    })

    if (account) {
       

        const transactionNo = await generatedBillNo();

        await Transaction.create({
            accountHolderId: account._id,
            accountNumber: account.accountNumber,
            transactionType: "received",
            amount: OpeningBalance,
            remark: "account opening",
            transactionNo,
        })
        
    
        return res.status(201).json(new ApiResponse(200, account, "Account create sucessfully "))
    
    }
    else{
        throw new ApiError(500, "some went wrong")

    }
})

// const getAccount = asyncHandler(async (req, res) => {
//     const { accountNo } = req.params;
//     console.log(typeof "accountNo");


//     const account = await AccountCreate.findOne({ accountNumber: accountNo });

//     if (account) {
//         return res.status(200).json(new ApiResponse(200, account));
//     }

//     throw new ApiError(500, "No data found");
// });
const getAccount = asyncHandler(async (req, res) => {
    const { accountNo } = req.params;
    console.log(typeof accountNo); // Log the type of accountNo

    const account = await AccountCreate.findOne({ accountNumber: accountNo });

    if (account) {
        return res.status(200).json(new ApiResponse(200, account));
    }

    throw new ApiError(500, "No data found");
});


const getAllAccount = asyncHandler(async (req, res) => {
    const account = await AccountCreate.find({}).sort({ data: -1 });

    if (account.length > 0) {
        return res.status(201).json(new ApiResponse(200, account, "all account"))
    }
    return res.status(201).json(new ApiResponse(200, "Data not found"))
})

const deleteAccount = asyncHandler(async (req, res) => {

    const { _id } = req.params;

    const account = await AccountCreate.findById(_id)
    if (!account) {
        return res.status(201).json(new ApiResponse(500, "account not found"))
    }

    const deleteAaccount = await AccountCreate.findByIdAndDelete(_id)

    if (deleteAaccount) {
        return res.status(201).json(new ApiResponse(400, deleteAaccount, '  deleted sucessfully'))
    }
    throw new ApiError(500, "some went wrong wile user register")

})

const updateAccount = asyncHandler(async (req, res) => {

    const { _id } = req.params;
    const { accountNumber, accountType, Name, Address, aadharNo, mobileNo, openingBlance, ClosingBalance } = req.body


    const account = await AccountCreate.findById(_id)
    if (!account) {
        return res.status(201).json(new ApiResponse(500, "account not found"))
    }

    const accountTransaction = await AccountCreate.findByIdAndUpdate(
        _id,
        {
            accountNumber,
            accountType,
            Name,
            Address,
            aadharNo,
            mobileNo,
            openingBlance,
            ClosingBalance

        },
        {
            new: true,
        }
    )

    if (accountTransaction) {
        return res.status(201).json(new ApiResponse(400, accountTransaction, 'update Account sucessfully'))
    }
    return res.status(201).json(new ApiResponse(400, 'some thing went rong'))

})


module.exports= {
    createAccount,
    getAccount,
    getAllAccount,
    deleteAccount,
    updateAccount
}