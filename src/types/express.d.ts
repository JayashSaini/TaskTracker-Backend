import { UserInstance } from "../models/user.models.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserInstance;
    }
  }
}
