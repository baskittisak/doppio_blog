import { ZodError } from "zod";

export const validateBodyRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetail = error.errors[0];
        const message = errorDetail.path[0] + ": " + errorDetail.message;
        res.status(400).json({ message });
      } else {
        next(error);
      }
    }
  };
};
