# Razorpay Payment Gateway

## How to Run Project
In the project directory, you can run:
### `node app.js or nodemon`

#### Prerequisites
- `Razorpay set-up`
- `node`

### To create a Razorpay account and generate the RAZORPAY_KEY_ID and RAZORPAY_SECRET for payment integration, follow these steps
- Go to https://razorpay.com/.
- Click on the "Sign Up" or "Sign Up for Free" button to create an account. You will need to provide your email address and set a password.
- Navigate to the dashboard and click on 'Account & Settings.'
- Go to 'Website and App Settings.'
- From the settings menu, select "API Keys" or a similar option.
- On the API Keys page, you will find options to generate API keys for both "Live" and "Testing"
- Razorpay will generate an RAZORPAY_KEY_ID and RAZORPAY_SECRET for your testing environment.
- Take note of the RAZORPAY_KEY_ID and RAZORPAY_SECRET. You will need these keys in your code for payment integration.
- Create a .env file.
- Add RAZORPAY_KEY_ID and RAZORPAY_SECRET to the .env file.