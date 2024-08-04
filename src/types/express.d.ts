import { UserInstance } from "../models/mongodb/user.models.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserInstance;
    }
  }
}
