const express = require('express');
const app = express();
const bookRoute = require('./routes/bookRoute')
const userRoute = require('./routes/userRoute')
const router = express.Router();
app.use(express.json());
new bookRoute(router);
new userRoute(router);
// app.use('/books', bookRoute);
// app.use('/users', userRoute);
app.use('/', router);
app.use('/', (req, res) => {
    res.send("It works!");
})

app.listen(8000, () => {
    console.log(`server is running on http://localhost:${8000}`);
})