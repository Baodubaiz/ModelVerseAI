import express from 'express';
import userRouter from './routes/User.route';
import aiModelRouter from './routes/AIModel.route';
import reviewRouter from './routes/Review.route';
import demoUsageRouter from './routes/DemoUsage.route';
import orderConfirmationRouter from './routes/OrderConfirmation.route';
import transactionVNDRoutes from './routes/Transaction_VND.route';
import transactionBlockchainRoutes from './routes/Transaction_Blockchain.route';
import categoryRouter from './routes/Category.route';
import loginRouter from './routes/Login.route';
import registerRoute from './routes/Register.route'
import cors from 'cors';



const app = express();
const port = 3001;
app.use(cors({
    origin: 'http://localhost:3000', // 👈 Cho phép frontend truy cập
    credentials: true,               // 👈 Nếu bạn dùng cookie thì bật cái này
}));

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/models', aiModelRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/demos', demoUsageRouter);
app.use('/api/confirmations', orderConfirmationRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/transactions_vnd', transactionVNDRoutes);
app.use('/api/transactions_blockchain', transactionBlockchainRoutes);
app.use('/api/login', loginRouter);
app.use('/api/register', registerRoute);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
