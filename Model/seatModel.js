import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
    seatIdentifier: {
        type: String,
        required: [true, "seatNumber is required!!"],
    },
    seatClass: {
        type: String,
        required: [true, "seatClass is required!!"],
        maxLength: 1
    },
    isBooked: {
        type: Boolean,
        required: [true, "booking check is required!!"],
        default: false
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking"
    }
}, { timestamps: true })

export const seatModel = mongoose.model("seat", seatSchema)