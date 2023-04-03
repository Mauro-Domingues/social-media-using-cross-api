import { Response, Router, Request } from 'express';

import CryptoProvider from '@shared/container/providers/CryptoProvider/implementations/CryptoProvider';

const keyRouter = Router();

keyRouter.get('/', async (_request: Request, response: Response) => {
  const keys = await new CryptoProvider().generateKeys();
  return response.send(keys);
});

export default keyRouter;
