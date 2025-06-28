import { Express } from "express";

declare module "express-serve-static-core" {
  interface Request {
    /** Present after `multer.single()` */
    file?: Express.Multer.File;
    /** Present after `multer.array()`/`fields()` */
    files?: Express.Multer.File[];
  }
}
