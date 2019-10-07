/* eslint-disable camelcase */
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import AccomodationServices from '../services/AccomodationServices';
import RoomServices from '../services/RoomServices';
import LikeServices from '../services/LikeServices';
import Util from '../utils/Utils';

dotenv.config();
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
const {
  createAccomodation,
  getByNameLocationRoom,
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
    const { accommodation_name, location, room_type } = req.body;

    if (req.user.role_value < 4) {
      return res.status(401).send({ status: 401, error: 'Access denied' });
    }

    const checkExist = await getByNameLocationRoom(
      accommodation_name.toLowerCase(), location.toLowerCase(), room_type.toLowerCase()
    );
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
      return next(error);
    }
  }

  /**
 *
 * @param {*} req
 * @param {*} res
 * @returns {*} registered accommodation
 */
  static async createHostAccommodation(req, res) {
    try {
      const accommodation = req.body;
      if (req.files && req.files.images) {
        let image = null;
        let imgExt = null;
        const multiImages = [];
        for (let i = 0; i < req.files.images.length; i++) {
          image = req.files.images[i].path;
          // checking if user uploaded valid picture
          imgExt = image.split('.').pop();
          if (imgExt !== 'jpg' && imgExt !== 'jpeg' && imgExt !== 'png' && imgExt !== 'bmp' && imgExt !== 'gif') {
            util.setError(415, 'Please Upload a valid image');
            return util.send(res);
          }
          // uploading to cloudinary
          const uploadPicture = await cloudinary.uploader.upload(image);
          multiImages.push({ image_url: uploadPicture.url });
        }
        accommodation.images = multiImages;
        accommodation.owner = req.user.id;
        createAccomodation(accommodation).then(() => {
          util.setSuccess(201, 'Accomodation added successfully!', accommodation);
          return util.send(res);
        });
      }
    } catch (error) {
      util.setError(500, 'Failed to add accommodation');
      return util.send(res);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {*} room
   */
  static async createRoom(req, res) {
    try {
      const room = req.body;
      if (req.files && req.files.images) {
        let image = null;
        let imgExt = null;
        const multiImages = [];
        for (let i = 0; i < req.files.images.length; i++) {
          image = req.files.images[i].path;
          // checking if user uploaded valid picture
          imgExt = image.split('.').pop();
          if (imgExt !== 'jpg' && imgExt !== 'jpeg' && imgExt !== 'png' && imgExt !== 'bmp' && imgExt !== 'gif') {
            util.setError(415, 'Please Upload a valid image');
            return util.send(res);
          }
          // uploading to cloudinary
          const uploadPicture = await cloudinary.uploader.upload(image);
          multiImages.push({ image_url: uploadPicture.url });
        }
        room.images = multiImages;
        addRoom(room).then(() => {
          util.setSuccess(201, 'Accomodation added successfully!', room);
          return util.send(res);
        });
      }
    } catch (error) {
      util.setError(500, 'Failed to add room');
      return util.send(res);
    }
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
  * @returns {*} like
  */
  static async likeAccommodation(req, res) {
    const like = await findLike(req.params.id, req.user.id);
    if (!like) {
      // create like
      const newLike = {
        user_id: req.user.id,
        accommodation_id: req.params.id,
        status: true
      };
      addLike(newLike).then(() => {
        util.setSuccess(201, 'Liked succesfully');
        return util.send(res);
      }).catch(() => {
        util.setError(500, 'Failed to add like');
        return util.send(res);
      });
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
