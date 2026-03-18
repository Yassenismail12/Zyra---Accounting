import express from 'express';

import dotenv from 'dotenv';
dotenv.config();

import { errorHandler } from './Shared/middlewares/errorHandler.middleware';
import AuthRouter from './Modules/Auth/auth.route';
import UserRouter from './Modules/Users/user.route';
import PartiesRouter from './Modules/Parties/parties.route';
import ProductRouter from './Modules/Products/product.route';
import BatchRouter from './Modules/batchs/batch.route';
// import InvoicesRouter from './Modules/Invoices/Invoices.route';
import PaymentRouter from './Modules/Payment/payment.route';
import WarehouseRouter from './Modules/warehouse/warehouse.route';

const app = express();

const port = Number(process.env.PORT);

//init Router
const authRouter = new AuthRouter()
const userRouter = new UserRouter()
const partyRouter = new PartiesRouter()
const productRouter = new ProductRouter()
// const invoiceRouter = new InvoicesRouter()
const paymentRouter = new PaymentRouter()
const batchRouter = new BatchRouter()
const warehouseRouter= new WarehouseRouter()

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints
app.get('/', (req, res) => {
    res.send("Welcome to Accounting System")
})
app.use(authRouter.router)
app.use(userRouter.router)
app.use(partyRouter.router)
app.use(productRouter.route)

app.use(paymentRouter.route)
// app.use(invoiceRouter.route)
app.use(batchRouter.route)
app.use(warehouseRouter.route)

//Error handler
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Accounting System app is running on port ${port}`);
});
