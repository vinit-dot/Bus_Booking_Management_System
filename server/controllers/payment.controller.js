const Booking = require('../models/Booking.model');
const { sendEmail } = require('../utils/email.util');

// Stripe
let stripe;
try { stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); } catch (e) {}

// Razorpay
let Razorpay;
try { Razorpay = require('razorpay'); } catch (e) {}

// @POST /api/payments/stripe/create-intent
const createStripeIntent = async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ success: false, message: 'Stripe not configured' });
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100), // paise/cents
      currency: 'inr',
      metadata: { bookingId: booking._id.toString() },
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/payments/stripe/confirm
const confirmStripePayment = async (req, res) => {
  try {
    const { bookingId, paymentIntentId } = req.body;
    const booking = await Booking.findById(bookingId).populate('user', 'name email').populate('route').populate('bus', 'busName');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.paymentStatus = 'paid';
    booking.paymentId = paymentIntentId;
    booking.bookingStatus = 'confirmed';
    booking.paymentMethod = 'stripe';
    await booking.save();

    // Send confirmation email
    await sendEmail({
      to: booking.contactEmail || booking.user.email,
      subject: `Booking Confirmed! - ${booking.bookingId}`,
      html: `
        <h2>🎉 Booking Confirmed!</h2>
        <p>Dear ${booking.user.name},</p>
        <p>Your booking has been confirmed.</p>
        <table>
          <tr><td><strong>Booking ID:</strong></td><td>${booking.bookingId}</td></tr>
          <tr><td><strong>Bus:</strong></td><td>${booking.bus?.busName}</td></tr>
          <tr><td><strong>From:</strong></td><td>${booking.route?.fromCity}</td></tr>
          <tr><td><strong>To:</strong></td><td>${booking.route?.toCity}</td></tr>
          <tr><td><strong>Date:</strong></td><td>${new Date(booking.travelDate).toDateString()}</td></tr>
          <tr><td><strong>Seats:</strong></td><td>${booking.selectedSeats.join(', ')}</td></tr>
          <tr><td><strong>Amount:</strong></td><td>₹${booking.totalAmount}</td></tr>
        </table>
        <p>Thank you for choosing BusBook!</p>
      `,
    }).catch(() => {});

    res.json({ success: true, message: 'Payment confirmed', data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/payments/razorpay/create-order
const createRazorpayOrder = async (req, res) => {
  try {
    if (!Razorpay) return res.status(500).json({ success: false, message: 'Razorpay not configured' });
    const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const order = await instance.orders.create({
      amount: Math.round(booking.totalAmount * 100),
      currency: 'INR',
      receipt: booking.bookingId,
    });

    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/payments/razorpay/verify
const verifyRazorpayPayment = async (req, res) => {
  try {
    const crypto = require('crypto');
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated = hmac.digest('hex');

    if (generated !== razorpay_signature)
      return res.status(400).json({ success: false, message: 'Payment verification failed' });

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: 'paid', paymentId: razorpay_payment_id, bookingStatus: 'confirmed', paymentMethod: 'razorpay' },
      { new: true }
    );

    res.json({ success: true, message: 'Payment verified', data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createStripeIntent, confirmStripePayment, createRazorpayOrder, verifyRazorpayPayment };
