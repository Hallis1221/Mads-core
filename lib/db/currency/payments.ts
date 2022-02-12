import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const PaymentsSchema = new mongoose.Schema({
    
    // The userID of the user who requested the payment
    userID: {
        type: String,
        required: true,
    },

    // The amount of the payment
    amount: {
        type: Number,
        required: true,
    },

    // The status of the payment
    status: {
        type: String,
        required: true,
    },

    // The type of the payment
    type: {
        type: String,
        required: true,
    },

    // The date the payment was created
    createdAt: {
        type: Date,
        required: true,
    },

    // The date the payment was updated
    updatedAt: {
        type: Date,
        required: false,
    },

    // The date the payment was completed
    completedAt: {
        type: Date,
        required: false,
    },

    // The date the payment was cancelled
    cancelledAt: {
        type: Date,
        required: false,
    },
});

const PaymentsDB = mongoose.models.Payments || mongoose.model("Payments", PaymentsSchema);

// EXPORTING OUR MODEL
export default PaymentsDB;
