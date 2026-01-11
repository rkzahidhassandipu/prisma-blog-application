import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing fields";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 404;
      errorMessage = "The requested resource was not found";
    } else if (err.code === "P2002") {
      statusCode = 409;
      errorMessage = "The requested resource already exists";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "An unknown error occurred with the database client";
  }
  else if(err instanceof Prisma.PrismaClientInitializationError){
    if(err.errorCode === 'P1000'){
      statusCode = 401;
      errorMessage = "Database connection failed";
    }
    else if(err.errorCode === 'P1001'){
      statusCode = 400;
      errorMessage = "can't reach database server";
    }
  }
  res.status(statusCode);
  res.json({
    message: errorMessage,
    err: errorDetails,
  });
}

export default errorHandler;
