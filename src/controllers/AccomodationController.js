/* eslint-disable camelcase */
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import AccomodationServices from '../services/AccomodationServices';
import RoomServices from '../services/RoomServices';
import LikeServices from '../services/LikeServices';
import Util from '../utils/Utils';
import { uploadImage, uploader } from '../utils/ImageUploader';

const {
  createAccomodation,
  getByNameLocation,
  findAllAccommodations,
  findAllAccommodationsByLocation,
  findAccommodationFeedback,
  getByOwner
} = AccomodationServices;
const { addRoom, findRoomById, getAllRoomsByAccommodation } = RoomServices;
const {
  addLike, updateLike, findLike, countLikes, userLiked,
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
      const imageUrl = await uploader(req.files.images);
      if (imageUrl) {
        req.body.images = imageUrl;
        accommodation.owner = req.user.id;
        const createdAcc = await createAccomodation(req.body);
        return res.status(201).send({ status: 201, message: 'Accomodation added successfully!', data: createdAcc.dataValues });
      }
      util.setError(415, 'Please Upload a valid image');
        return util.send(res);
    } catch (error) { return next(error); }
  }

    /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {*} registered accommodation
   */
  static async getAccommodationOwner(req, res, next) {
    try {
      const accommodations = await getByOwner(req.user.id);
      return res.status(201).send({ status: 200, message: 'All your accommodations', data: accommodations });
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
      const imageUrl = await uploader(req.files.images);
      if (imageUrl) {
        req.body.images = imageUrl;
        const createdRoom = await addRoom(req.body);
        return res.status(201).send({ status: 201, message: 'Room succesifully added', data: createdRoom.dataValues });
      }
      util.setError(415, 'Please Upload a valid image');
        return util.send(res);
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
    singleAccommodation.liked = false;
    if (req.user != null) {
      const check = await userLiked(req.user.id, req.params.id);
      singleAccommodation.liked = check;
    }
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
