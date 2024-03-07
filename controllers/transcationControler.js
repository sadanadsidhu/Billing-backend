
const  AccountCreate  = require("../models/accountCreateModel")
const  Transaction  = require('../models/transcationModel');
const   TransactionUpdateType  = require('../constant.js');
const ApiResponse  =require ('../utils/ApiResponse.js')

const generatedBillNo = async () => {
    return await Transaction.generateBillNumber();
};
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const createTransaction = asyncHandler(async (req, res) => {


    const { accountHolderId, transactionType, amount, date, remark } = req.body

    const transactionNo = await generatedBillNo();

    const account = await AccountCreate.findById({ _id: accountHolderId });

    if (!account) {
        throw new ApiError(409, "account not found")
    }

    if (transactionType === "received") {

        const savingTansactions = await Transaction.create({
            accountHolderId,
            accountNumber: account.accountNumber,
            transactionType,
            amount,
            remark,
            transactionNo
        })
        account.ClosingBalance = account.ClosingBalance + amount
        await account.save()

        return res.status(201).json(new ApiResponse(200, {
            transaction: savingTansactions,
            account: account
        }, "transaction complited"))


    } else if (transactionType === "payment") {

        if (account.ClosingBalance >= amount) {
            const withDrawTansactions = await Transaction.create({
                accountHolderId,
                accountNumber: account.accountNumber,
                transactionType,
                amount,
                date,
                remark,
                transactionNo

            })
            account.ClosingBalance = account.ClosingBalance - amount
            await account.save()

            return res.status(201).json(new ApiResponse(200, {
                transaction: withDrawTansactions,
                account: account
            }, "transaction complited"))
        }
        return res.status(201).json(new ApiResponse(200, "Insuficent blance"))


    }
})

const getAllTransaction = asyncHandler(async (req, res) => {

    const transaction = await Transaction.find({}).sort({ _id: -1 });

    if (transaction.length > 0) {
        return res.status(201).json(new ApiResponse(200, transaction, "all transaction"))
    }
    return res.status(201).json(new ApiResponse(200, "Data not found"))


})

const deleteTransaction = asyncHandler(async (req, res) => {

    const { _id } = req.params;

    const transaction = await Transaction.findById(_id)
    if (!transaction) {
        return res.status(201).json(new ApiResponse(500, "transaction not found"))
    }
    const deleteTransaction = await Transaction.findByIdAndDelete(_id)

    if (deleteTransaction) {

        const { ClosingBalance } = await AccountCreate.findOne({ accountNumber: transaction.accountNumber })

        if (transaction.transactionType === "payment") {

            await AccountCreate.updateOne(
                { accountNumber: transaction.accountNumber },
                {
                    $set: {
                        ClosingBalance: ClosingBalance + transaction.amount
                    }
                },
                { new: true }
            )

        } else if (transaction.transactionType === "received") {
            await AccountCreate.updateOne(
                { accountNumber: transaction.accountNumber },
                {
                    $set: {
                        ClosingBalance: ClosingBalance - transaction.amount
                    }
                },
                { new: true }
            )
        }

        return res.status(201).json(new ApiResponse(400, '', 'transaction deleted sucessfully'))
    }
    throw new ApiError(500, "some went wrong")

})

// const deleteTransaction = asyncHandler(async (req, res) => {
//     const { _id } = req.params;

//     const transaction = await Transaction.findById(_id);
//     if (!transaction) {
//         return res.status(404).json(new ApiResponse(404, "Transaction not found"));
//     }

//     const deleteTransaction = await Transaction.findByIdAndDelete(_id);

//     if (deleteTransaction) {
//         const account = await AccountCreate.findOne({ accountNumber: transaction.accountNumber });

//         if (!account) {
//             return res.status(404).json(new ApiResponse(404, "Account not found"));
//         }

//         let closingBlance = account.closingBlance || 0;

//         if (transaction.transactionType === "payment") {
//             closingBlance += transaction.amount;
//         } else if (transaction.transactionType === "received") {
//             closingBlance -= transaction.amount;
//         }

//         await AccountCreate.updateOne(
//             { accountNumber: transaction.accountNumber },
//             { $set: { closingBlance } }
//         );

//         return res.status(200).json(new ApiResponse(200, '', 'Transaction deleted successfully'));
//     }

//     throw new ApiError(500, "Something went wrong");
// });

// const updateTransaction = asyncHandler(async (req, res) => {
//     const { _id } = req.params
//     const { accountType, transactionType, accountNo, Amount, date, remark, updateType } = req.body

//     // const existingTransaction = await Transaction.findOne{(_id._id)};
//     // if (!existingTransaction) {
//     //     return res.status(201).json(new ApiResponse(500, "transaction not found"))
//     // }
//     const existingTransaction = await Transaction.findOne({ _id });
// if (!existingTransaction) {
//     return res.status(201).json(new ApiResponse(500, "Transaction not found"));
// }

//     if (updateType === TransactionUpdateType.accountNo) {

//         // first reverese the amount from previous account
//         await AccountCreate.updateOne({ _id: existingTransaction.accountHolderId },
//             {
//                 $set: {
//                     ClosingBalance: ClosingBalance - existingTransaction.amount,
//                 }
//             },
//             { new: true }
//         )

//         // add the amount of new account number 
//         const newAccounts = await AccountCreate.findOne({ _id: accountNo })
//         if (newAccounts) {
//             if (existingTransaction.accountType === "recived") {
//                 await AccountCreate.updateOne({ _id: newAccountCreate._id },
//                     {
//                         $set: {
//                             ClosingBalance: ClosingBalance + existingTransaction.amount,

//                         }
//                     }, {
//                     new: true
//                 })
//             } else if (existingTransaction.accountType === "payment") {
//                 await AccountCreate.updateOne({ _id: AccountCreate._id },
//                     {
//                         $set: {
//                             ClosingBalance: ClosingBalance - existingTransaction.amount,
//                         }
//                     }, {
//                     new: true
//                 })
//             }
//         }

//         // update the exesisiting transactions in account number
//         await Transaction.findByIdAndUpdate(_id,
//             {
//                 $set: {
//                     accountNumber: accountNo
//                 }
//             },
//             { new: true }

//         )

//     } else if (updateType === TransactionUpdateType.transactionType) {

//         // first update amount on accounts 
//         if(transactionType === "reacived"){
//             await AccountCreate.updateOne({ _id: existingTransaction.accountHolderId },
//                 {
//                     $set: {
//                         ClosingBalance: ClosingBalance + existingTransaction.amount,
//                     }
//                 }, {
//                 new: true
//             })
//         }else if(transactionType === "reacived"){
//             await AccountCreate.updateOne({ _id: existingTransaction.accountHolderId },
//                 {
//                     $set: {
//                         ClosingBalance: ClosingBalance - existingTransaction.amount,
//                     }
//                 }, {
//                 new: true
//             })
//         }

//         // after that update the transaction 



//     } else if (updateType === TransactionUpdateType.amount) {

//         // if ammount is grate

//     }








//     return res.status(201).json(new ApiResponse(400, 'some thing went rong'))


// })

const updateTransaction = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const { accountType, transactionType, accountNo, Amount, date, remark, updateType } = req.body;

    const existingTransaction = await Transaction.findOne({ _id });
    if (!existingTransaction) {
        return res.status(404).json(new ApiResponse(404, "Transaction not found"));
    }

    // Fetching the existing account
    const existingAccount = await AccountCreate.findById(existingTransaction.accountHolderId);
    if (!existingAccount) {
        return res.status(404).json(new ApiResponse(404, "Account not found"));
    }

    // Switching based on the update type
    switch (updateType) {
        case TransactionUpdateType.accountNo: {
            // Your logic for updating account number
            break;
        }
        case TransactionUpdateType.transactionType: {
            // Your logic for updating transaction type
            break;
        }
        case TransactionUpdateType.amount: {
            // Your logic for updating amount
            break;
        }
        default: {
            return res.status(400).json(new ApiResponse(400, 'Invalid update type'));
        }
    }

    return res.status(201).json(new ApiResponse(400, 'Some thing went wrong'));
});


const transactionReport = asyncHandler(async (req, res) => {

    const transaction = await Transaction.find({}).populate("accountHolderId").sort({ _id: -1 })

    if (transaction.length > 0) {
        return res.status(201).json(new ApiResponse(201, transaction, 'All transaction reports'))
    }
    throw new ApiError(500, "No data found")

})

module.exports={
    createTransaction,
    getAllTransaction,
    updateTransaction,
    deleteTransaction,
    transactionReport
}