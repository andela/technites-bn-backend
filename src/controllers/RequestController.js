/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import jwt from 'jsonwebtoken';
import RequestServices from '../services/RequestServices';
import UserService from '../services/UserServices';
import Util from '../utils/Utils';

const {
  fetchRequests, createRequest, sendRequestConfirmation, approveTrip, rejectTrip, updateRequest
} = RequestServices;

const { findUserByEmail } = UserService;

const util = new Util();

let msgType = null;
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
    if (req.user.id === parseInt(req.params.id, 10) || req.user.role_value === 7) {
      const requests = await fetchRequests(req, res);
      if (requests && requests.length) {
        return res.status(200).json({
          status: res.statusCode,
          message: 'user requests',
          data: requests
        });
      }
      return res.status(200).json({
        status: res.statusCode,
        message: 'This user doesn\'t have any available requests!'
      });
    }
  }

  /**
     *
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} newUser
     */
  static async createRequest(req, res) {
    const user = await findUserByEmail(req.user.email);

    const request = req.body;
    request.user_id = user.id;

    const newRequest = await createRequest(request);

    const token = jwt.sign({ id: newRequest.id }, process.env.JWT_SECRET, { expiresIn: '365d' });

    sendRequestConfirmation(token, user, newRequest);

    res.status(201).json({ status: res.statusCode, message: 'Sent request. Please wait travel admin to approve it', data: newRequest });
  }

  /**
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} updated request
 */
  static async updateRequest(req, res) {
    const request = req.body;
    const { user } = req;
    const updatedRequest = await updateRequest(req.userRequest.id, request);
    const token = jwt.sign({ id: req.userRequest.id }, process.env.JWT_SECRET, { expiresIn: '365d' });
    sendRequestConfirmation(token, user, req.userRequest, msgType = 'Request Update');
    util.setSuccess(200, 'Request successfully Updated!', updatedRequest);
    return util.send(res);
  }

  /**
    * @function getRequests
    * @param {Object} req request
    * @param {Oject} res request
    * @returns {Object} object
    */
  static async approveRequest(req, res) {
    RequestController.checkIds(req, res);

    RequestController.isTravelAdmin(req, res);

    const result = await approveTrip(req.params.req_id);
    if (result[0] === 0) return res.status(200).json({ status: '400', message: 'The request with the given id does not exists' });

    return res.status(200).json({ status: '200', message: 'Approved request successfully' });
  }

  /**
    * @function getRequests
    * @param {Object} req request
    * @param {Oject} res request
    * @returns {Object} object
    */
  static async rejectRequest(req, res) {
    RequestController.checkIds(req, res);

    RequestController.isTravelAdmin(req, res);

    const result = await rejectTrip(req.params.req_id);
    if (result[0] === 0) return res.status(200).json({ status: '400', message: 'The request with the given id does not exists' });

    return res.status(200).json({ status: res.statusCode, message: 'Rejected request successfully' });
  }

  /**
    * @function getRequests
    * @param {Object} req request
    * @param {Oject} res request
    * @returns {Object} object
    */
  static async checkIds(req, res) {
    if (isNaN(req.params.id) || isNaN(req.params.req_id)) {
      return res.status(400).json({ status: '400', message: 'If you are trying to pass an id, please use a number' });
    }
  }

  /**
    * @function getRequests
    * @param {Object} req request
    * @param {Oject} res request
    * @returns {Object} object
    */
  static async isTravelAdmin(req, res) {
    if (req.user.role_value < 4) {
      return res.status(403).json({ status: '403', message: 'Forbidden. You are not a travel admin ' });
    }
  }
}

export default RequestController;
