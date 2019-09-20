/* eslint-disable camelcase */
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import AccomodationServices from '../services/AccomodationServices';

dotenv.config();
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;
cloudinary.config({ cloud_name: CLOUD_NAME, api_key: CLOUD_API_KEY, api_secret: CLOUD_API_SECRET });

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

    const checkExist = await getByNameLocationRoom(accommodation_name.toLowerCase(), location.toLowerCase(), room_type.toLowerCase());
    if (checkExist.length > 0) {
      return res.status(409).send({ status: 409, error: 'Accommodation facility already exist' });
    }

    const imagesPath = req.files.images.path;
    try {
      cloudinary.uploader.upload(imagesPath, async (result, error) => {
        if (error) {
          return res.status(400).send({ status: 400, error });
        }

        req.body.images = result.url;
        req.body.accommodation_name = accommodation_name.toLowerCase();
        req.body.location = location.toLowerCase();
        req.body.room_type = room_type.toLowerCase();
        const created = await createAccomodation(req.body);

        return res.status(201).send({
          status: 201,
          message: 'Accomodation facility succesifully created',
          data: created
        });
      });
    } catch (error) {
      return res.status(500).send({ status: 500, error: 'Something unexpected happened' });
    }
  }
}

export default AccomodationControler;
