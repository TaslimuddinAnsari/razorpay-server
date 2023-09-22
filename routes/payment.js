const express = require('express');
const Razorpay = require('razorpay');
require("dotenv").config();
const router = express.Router();

router.post('/orders', async (req, res) => {
    try {

        const { amount, currency, payment_capture } = req.body;
        // const amount = 300;
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });
        const options = {
            amount: amount * 100, // amount in the smallest unit.
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

router.post('/success', async (req, res) => {
    try {
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: 'Transaction not legit!' });

        const newPayment = PaymentDetails({
            razorpayDetails: {
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
                signature: razorpaySignature,
            },
            success: true,
        });

        await newPayment.save();

        res.json({
            msg: 'success',
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;