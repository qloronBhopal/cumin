module.exports = ({
    res,
    status = null,
    isError = null,
    message = "",
    count = null,
    data = [],
    err = null,
    msg = null,
    success = null,
    errorCode = null,
    successCode = null,
    responseStatusCode = null
}) => {
    const resObj = {
        status: status === null ? null : status,
        isError,
        message: isError === null ? "err -> 500 -> Please Provide standardResponse!" : message,
        msg,
        success: success === null ? !isError : success,
        errorCode,
        successCode,
        count: count === null ? data.length : count,
        data,
        err
    };

    Object.keys(resObj).forEach((val) => resObj[val] === null && delete resObj[val]);

    if (responseStatusCode === null) {
        res.json(resObj);
    } else {
        res.status(responseStatusCode).json(resObj);
    }
};
