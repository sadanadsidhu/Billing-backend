const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
    accountHolderId: {
        type: Schema.Types.ObjectId,
        ref: "AccountCreate",
        required: false,
    },
    // accountNumber: {
    //     type: Number,
    //     required: false,
    // },
    transactionType: {
        type: String,
        required: false,
        enum: ['received', 'payment']
    },
    amount: {
        type: Number,
        required: false,
    },
    remark: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now
    },
    transactionNo: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

transactionSchema.statics.generateBillNumber = async function () {
    let updatedTransaction = await this.findOne();
    if (!updatedTransaction) {
        updatedTransaction = await this.create({});
    }
    updatedTransaction = await this.findOneAndUpdate({}, { $inc: { transactionNo: 1 } }, { new: true });
    return updatedTransaction.transactionNo;
};

module.exports = mongoose.model("Transaction", transactionSchema);

