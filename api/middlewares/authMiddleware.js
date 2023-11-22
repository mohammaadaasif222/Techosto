  import { errorHandler } from "../utils/error.js";
  export function authorizeRoles (...roles) {

    return (req, res, next) => {
      if (!roles.includes(req.agency.role)) {
        return next(
         errorHandler(
           403,
            `Role (${req.agency.role}) is not allowed to access this resource`
          )
        );
      } 
      next();
    };
  }
