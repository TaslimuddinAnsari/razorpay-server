const express = require("express");
const orderRouter = require("./routes/payment");
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json({ extended: false }));
// route included
app.use("/payment", orderRouter);

app.listen(port, () => console.log(`server started on port ${port}`));