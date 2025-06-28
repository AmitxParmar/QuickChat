import { NextFunction, Request, Response } from "express";

export interface MsgQuery {
  from: string;
  to: string;
}

type MulterRequest<Q> = Request<{}, any, any, Q> & {
  file?: Express.Multer.File;
};

export type MulterHandler<Q> = (
  req: MulterRequest<Q>,
  res: Response,
  next: NextFunction
) => Promise<void>;
