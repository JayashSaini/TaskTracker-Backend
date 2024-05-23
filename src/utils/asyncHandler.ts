import { Request, Response, NextFunction } from "express";

function asyncHandler(
  queryFunction: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(queryFunction(req, res, next)).catch((err) => next(err));
  };
}

export { asyncHandler };
