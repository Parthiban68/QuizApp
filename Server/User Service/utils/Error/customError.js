class customError extends Error{
    constructor(message,stautsCode){
        super(message);
        this.stautsCode = stautsCode;
        this.status = stautsCode >= 400 && stautsCode < 500 ? 'fail': 'error';

        this.isOperational = true;

        Error.captureStackTrace(this,this.constructor);
    }
}

module.exports = customError