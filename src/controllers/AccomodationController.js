/* eslint-disable camelcase */
import cloudinaryUpload from '../utils/cloudinary';
import AccomodationServices from '../services/AccomodationServices';
import { check } from 'express-validator';

const { createAccomodation, getByNameLocationRoom } = AccomodationServices;


/**
 * @class AccomodationControler
 */
class AccomodationControler {
  /**
     *
     * @param {*} req
     * @param {*} res
     * @returns {object} returns an object of the newly added accomodation
     */
  static async createAccomodation(req, res) {
    const { accommodation_name, location, room_type } = req.body;
    if (req.user.role_value < 4) {
      return res.status(401).send({ status: 401, error: 'Access denied' });
    }
    const checkExist = await getByNameLocationRoom(accommodation_name, location, room_type);
    if (checkExist.length > 0) {
      return res.status(409).send({ status: 409, error: 'Accommodation facility already exist' });
    }
    try {
      const uploaded = await cloudinaryUpload(req.files.images.tempFilePath);
      req.body.images = uploaded.url;
      const created = await createAccomodation(req.body);
      return res.status(201).send({ status: 201, message: 'Accomodation facility succesifully created', data: created });
    // eslint-disable-next-line no-empty
    } catch (error) {

    }
  }
}

export default AccomodationControler;
