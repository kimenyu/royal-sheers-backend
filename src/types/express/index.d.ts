// src/types/express/index.d.ts
declare namespace Express {
    export interface Request {
      file?: Multer.File;
    }
  }
  