import express ,{ Response , Request } from 'express';

import dotenv from 'dotenv';
dotenv.config();

import { errorHandler } from './Shared/middlewares/errorHandler.middleware';

const app = express();

const port = process.env.PORT;

app.use(errorHandler)

app.get('/', (req:Request, res:Response) => {
    res.send('Accounting System app is running!');
});

app.listen(port, () => {
    console.log(`Accounting System app is running on port ${port}`);
});
