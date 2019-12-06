/* eslint-disable camelcase */
import LocationServicies from '../services/LocationServices';
import database from '../database/models';
const { getAllLocations } = LocationServicies;

/**
 * @class LocationController
 */
class LocationController {
  /**
      * @method createComment
      * @param {Object} req request
      * @param {Oject} res request
      * @returns {Object} object
      */
  static async getLocations(req, res) {
    const locations = await getAllLocations();
    return res.status(200).send({ status: 200, message: 'all locations', data: { locations } });
  }

}

export default LocationController;
