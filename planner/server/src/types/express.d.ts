import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export interface AuthRequest extends Request {
  userId: string;
}

export type RequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
> = (
  req: AuthRequest,
  res: Response<ResBody, Locals>,
  next: NextFunction
) => void | Promise<void>;

export interface TaskRequestHandler extends RequestHandler {
  (req: AuthRequest & { file?: Express.Multer.File }, res: Response, next: NextFunction): Promise<void>;
} 