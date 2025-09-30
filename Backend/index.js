import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";


import userRouter from './routes/userRoute.js';
import stockRouter from './routes/stockRoute.js';
import postRouter from './routes/postRoute.js';
import wrouter from './routes/watchlistRoute.js';
import connectDB from './config/Mongodb.js';
import orderRouter from './routes/orderRoute.js';
import { authMiddleware } from './middleware/auth.js';

const app =express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const port =process.env.Port ||4000;

app.use(cors());
app.use(express.json());

connectDB();

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/user',userRouter)
app.use("/api/stocks",authMiddleware, stockRouter);
app.use('/api/posts',authMiddleware, postRouter);
app.use('/api/watchlist',authMiddleware,wrouter)
app.use("/api/order",authMiddleware,orderRouter);

app.get('/' ,(req,res)=>{
    res.send("API is Working")
})

io.on("connection", socket => {
  console.log("Client connected");
  socket.on("disconnect", ()=> console.log("Client disconnected"));
});

server.listen(port,()=>{
    console.log("server started on :"+port)
})