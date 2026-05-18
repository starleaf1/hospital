import express from 'express';
import routes from './interfaces/http/routes';
import { errorMiddleware } from './interfaces/http/middlewares/errorMiddleware';

const app = express();

app.use(express.json());

app.use('/api/v1', routes);

app.use(errorMiddleware);

export default app;
