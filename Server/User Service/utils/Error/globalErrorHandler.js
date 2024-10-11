const errorHandler = (error,req,res,next) => {
   error.statusCode = error.statusCode || 500;
    const status = error.status || "error"
    return res.status(error.statusCode).json({status : status, message: error.message});
  }

  module.exports = errorHandler