const express = require('express');
const Razorpay = require('razorpay');
require("dotenv").config();
const router = express.Router();
const Payment = require('../models/paymentModel.js');
const crypto = require('crypto');


router.post('/orders', async (req, res) => {
    try {
        const { amount, currency, payment_capture } = req.body;
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });
        const options = {
            amount: Number(amount * 100), // amount in the smallest unit.
            currency: currency || 'INR',
            payment_capture: payment_capture || 1,
        }
        const order = await instance.orders.create(options);
        if (!order) return res.send({ code: 500, message: 'Internal Error' });
        res.status(200).send({ data: order, code: 200, message: 'order created' });
    }
    catch (err) {
        res.send({ err: err, code: 500, message: 'Internal Error' });
    }
});

router.post('/verify', async (req, res) => {

    try {
        const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature, } = req.body;

        const body = razorpayOrderId + "|" + razorpayPaymentId;

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");
        if (expectedSignature) {

            // Create a new Payment document
            const payment = new Payment({
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature,
            });
            // Save the Payment document to the database
            await payment.save();
            res.redirect('http://localhost:3000/');
        }
        else {
            res.status(400).json({ msg: 'Transaction not legit!' });
        }

    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send(error);
    }
});


module.exports = router;