import { Router } from 'express';
import guardRouter from './guardRouter';
import userRouter from './userRouter';
import keyRouter from './generateKeysRouter';
import postRouter from './postRouter';

const routes = Router();

routes.use('/generate-keys', keyRouter);
routes.use(guardRouter);
routes.use('/', userRouter);
routes.use('/', postRouter);

export default routes;
