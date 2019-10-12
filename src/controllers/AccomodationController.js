/* eslint-disable camelcase */
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import AccomodationServices from '../services/AccomodationServices';
import RoomServices from '../services/RoomServices';
import LikeServices from '../services/LikeServices';
import Util from '../utils/Utils';
import { uploadImages, uploadImage } from '../utils/ImageUploader';

dotenv.config();
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
const {
  createAccomodation,
  getByNameLocation,
  findAllAccommodations,
  findAllAccommodationsByLocation,
  findAccommodationFeedback
} = AccomodationServices;
const { addRoom, findRoomById, getAllRoomsByAccommodation } = RoomServices;
const {
  addLike, updateLike, findLike, countLikes
} = LikeServices;
const util = new Util();
/**
 * @class AccomodationControler
 */
class AccomodationControler {
  /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @returns {object} returns an object of the newly added accomodation
     */
  static async createAccomodation(req, res, next) {
    const { accommodation_name, location } = req.body;
    if (req.user.role_value < 4) {
      return res.status(401).send({ status: 401, error: 'Access denied' });
    }
    const checkExist = await getByNameLocation(accommodation_name, location);

    if (checkExist.length > 0) {
      return res.status(409).send({ status: 409, error: 'Accommodation facility already exist' });
    }
    const imagesPath = req.files.images.path;
    try {
      const imageUrl = await uploadImage(imagesPath);
      if (imageUrl) {
        req.body.images = imageUrl;
        const created = await createAccomodation(req.body);
        return res.status(201).send({ status: 201, message: 'Accomodation facility succesifully created', data: created });
      }
      res.status(400).send({ status: 400, error: 'Invalid image upload' });
    } catch (error) {
      next(error);
    }
  }

  /**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {*} registered accommodation
 */
  static async createHostAccommodation(req, res, next) {
    try {
      const accommodation = req.body;
      if (req.files && req.files.images) {
        const arr = await uploadImages(req.files.images);
        if (arr.every((item) => item != null)) {
          accommodation.images = arr;
          accommodation.owner = req.user.id;
          return createAccomodation(accommodation).then(() => {
            util.setSuccess(201, 'Accomodation added successfully!', accommodation);
            return util.send(res);
          });
        }
        util.setError(415, 'Please Upload a valid image');
        return util.send(res);
      }
    } catch (error) { return next(error); }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {*} room
   */
  static async createRoom(req, res, next) {
    try {
      const room = req.body;
      if (req.files && req.files.images) {
        const arr = await uploadImages(req.files.images);
        if (arr.every((v) => v != null)) {
          room.images = arr;
          return addRoom(room).then(() => {
            util.setSuccess(201, 'Accomodation added successfully!', room);
            return util.send(res);
          });
        }
        util.setError(415, 'Please Upload a valid image');
        return util.send(res);
      }
    } catch (error) { return next(error); }
  }

  /**
 *
 * @param {*} req
 * @param {*} res
 * @returns {*} user
 */
  static async viewSingleRoom(req, res) {
    const singleRoom = await findRoomById(req.params.id);
    if (!singleRoom) {
      util.setError(404, 'Room not found');
      return util.send(res);
    }
    util.setSuccess(200, 'Room found!', singleRoom);
    return util.send(res);
  }

  /**
 *
 * @param {*} req
 * @param {*} res
 * @returns {*} user
 */
  static async viewSingleAccommodation(req, res) {
    // let singleAccommodation;
    const singleAccommodation = await findAccommodationFeedback(req.params.id);
    if (!singleAccommodation) {
      util.setError(404, 'Accommodation not found');
      return util.send(res);
    }
    const likes = await countLikes(req.params.id);
    singleAccommodation.likes = likes;
    util.setSuccess(200, 'Accommodation found!', singleAccommodation);
    return util.send(res);
  }

  /**
 *
 * @param {*} req
 * @param {*} res
 * @returns {*} user
 */
  static async viewAllRoomsByAccommodation(req, res) {
    const allRooms = await getAllRoomsByAccommodation(req.params.id);
    util.setSuccess(200, `All Rooms belonging to ${allRooms.accommodation_name}`, allRooms);
    return util.send(res);
  }

  /**
 *
 * @param {*} req
 * @param {*} res
 * @returns {*} user
 */
  static async viewAllAccommodations(req, res) {
    const accommodation = await findAllAccommodations();
    util.setSuccess(200, 'All Accommodation', accommodation);
    return util.send(res);
  }

  /**
 *
 * @param {*} req
 * @param {*} res
 * @returns {*} user
 */
  static async viewAllAccommodationsByLocation(req, res) {
    const accommodation = await findAllAccommodationsByLocation(req.params.id);
    util.setSuccess(200, 'All Accommodation', accommodation);
    return util.send(res);
  }

  /**
  *
  * @param {*} req
  * @param {*} res
  * @param {*} next
  * @returns {*} like
  */
  static async likeAccommodation(req, res, next) {
    const like = await findLike(req.params.id, req.user.id);
    if (!like) {
      // create like
      const newLike = { user_id: req.user.id, accommodation_id: req.params.id, status: true };
      addLike(newLike).then(() => {
        util.setSuccess(201, 'Liked succesfully');
        return util.send(res);
      }).catch((error) => next(error));
    } else {
      const updatedLike = {
        status: false,
      };
      if (like.status === false) {
        updatedLike.status = true;
        await updateLike(req.params.id, req.user.id, updatedLike);
        util.setSuccess(200, 'Liked succesfully');
        return util.send(res);
      }
      await updateLike(req.params.id, req.user.id, updatedLike);
      util.setSuccess(200, 'Disliked succesfully');
      return util.send(res);
    }
  }
}
export default AccomodationControler;
