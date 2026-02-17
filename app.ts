import express from 'express';

import dotenv from 'dotenv';
dotenv.config();

import { errorHandler } from './Shared/middlewares/errorHandler.middleware';
import AuthRouter from './Modules/Auth/auth.route';
import UserRouter from './Modules/Users/user.route';

const app = express();

const port = process.env.PORT;

//init Router
const authRouter= new AuthRouter()
const userRouter= new UserRouter()

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints
app.use(authRouter.router)
app.use(userRouter.router)

//Error handler
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Accounting System app is running on port ${port}`);
});
