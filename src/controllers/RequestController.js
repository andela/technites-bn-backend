import RequestServices from '../services/RequestServices';

const { userRequest } = RequestServices;
/**
 * @class RequestController
 */
class RequestController {
  /**
    * @function getRequests
    * @param {Object} req request
    * @param {Oject} res request
    * @returns {Object} object
    */
  static async getRequests(req, res) {
    // FIXME: check if isAdmin and bypass
    if (req.user.id !== parseInt(req.params.id, 10)) {
      return res.status(403).json({ status: res.statusCode, message: 'You are not allowed to retrieve other users requests' });
    }
    const requests = await userRequest(req.params.id);
    return res.status(200).json({ status: res.statusCode, message: 'user requests', data: requests });
  }
}

export default RequestController;
