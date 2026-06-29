class apiResponse {
    constructor(
        statusCode,
        message = "Success",
        data = null,
        errors = [],
    ){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.errors = errors;
        this.success = statusCode < 400;
    }
}

export default apiResponse;