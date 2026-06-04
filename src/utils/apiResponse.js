class apiResponse {
    constructor(
        statusCode,
        message = "Success",
        data = null,
        errors = [],
        success = true
    ){
        this.statusCode = statusCode < 400
        this.data = data
        this.message = message
        this.errors = errors
        this.success = true
    }
}

export default apiResponse;