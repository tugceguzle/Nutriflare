import 'dotenv/config';
import express from 'express';
import routes from './src/routes/index.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import cors from "cors"

const app = express();
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB: Connectted'))
  .catch((err) => console.log(err.message));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(routes);


app.listen(5000, () => console.log('Server is up!'));



