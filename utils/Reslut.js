class BaseModel {
    constructor(errorCode,reason, data) {
        this.errorCode = errorCode
        if (reason) {
            this.reason = reason
        }
        this.data = data
    }
}

class SuccessModel extends BaseModel {
    constructor(reason,data) {
        super(0,reason, data)
    }
}

class ErrorModel extends BaseModel {
    constructor(code,reason, data) {
        super(code,reason, data)
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
