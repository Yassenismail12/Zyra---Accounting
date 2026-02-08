import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Accounting System app is running!');
});

app.listen(port, () => {
    console.log(`Accounting System app is running on port ${port}`);
});
