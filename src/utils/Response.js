/**
   * @class Response
   * @description formats the response given to a user
   * @returns {object} - object containing response data
   */
class Response {
  /**
     * @description set the diffrent states of a response
     */
  constructor() {
    this.statusCode = null;
    this.type = null;
    this.data = null;
    this.message = null;
  }

  /**
     * @method setSuccess
     * @description format a success response
     * @returns {object} - success response object
     * @param {*} statusCode
     * @param {*} message
     * @param {*} data
     */
  setSuccess(statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.type = 'success';
  }

  /**
     * @method setError
     * @description format an error response
     * @returns {object} - error response object
     * @param {*} statusCode
     * @param {*} message
     * @param {*} data
     */
  setError(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
    this.type = 'error';
  }

  /**
     * @method send
     * @description send the actual set response to a user
     * @returns {object} - response object
     * @param {*} res
     */
  send(res) {
    const result = {
      status: this.statusCode,
      message: this.message,
      data: this.data,
    };
    if (this.type === 'success') {
      return res.status(this.statusCode).json(result);
    }
    return res.status(this.statusCode).json({
      status: this.statusCode,
      error: this.message,
    });
  }
}

export default Response;
