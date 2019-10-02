/* eslint-disable camelcase */
import database from '../database/models';

/**
 * @class LocationServices
 */
class LocationServices {
  /**
      *
      * @param {Integer} id
      * @returns {object} returns the location
      */
  static async findLocationById(id) {
    return database.location.findOne({ where: { id } });
  }
}

export default LocationServices;
