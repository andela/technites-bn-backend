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
  getByNameLocation,
  findAllAccommodations,
  findAllAccommodationsByLocation,
  findAccommodationFeedback,
  findAccommodation
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
    const { accommodation_name, description, location } = req.body;

    if (req.user.role_value < 4) {
      return res.status(401).send({ status: 401, error: 'Access denied' });
    }
    try {
      const checkExist = await getByNameLocation(accommodation_name, location);

      if (checkExist.length > 0) {
        return res.status(409).send({ status: 409, error: 'Accommodation facility already exist' });
      }

      const { images } = req.files;

      let uploadedImageUrl;

      if (!images.length) {
        const result = await cloudinary.uploader.upload(images.path);
        uploadedImageUrl = result.url;
      } else if (images.length >= 2) {
        const uploads = await images.map(async (image) => {
          const result = await cloudinary.uploader.upload(image.path);
          return result.url;
        });
        uploadedImageUrl = await Promise.all(uploads);
      } else { uploadedImageUrl = null; }

      const newAccommodation = {
        accommodation_name,
        description,
        location,
        images: uploadedImageUrl
      };

      const created = await createAccomodation(newAccommodation);

      return res.status(201).send({
        status: 201,
        message: 'Accomodation facility succesifully created',
        data: created
      });
    } catch (error) {
      res.status(500).send({ status: 500, error: 'Internal server error' });
      return next(error);
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
      res.status(500).send({ status: 500, error: 'Internal server error' });
      return next(error);
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
