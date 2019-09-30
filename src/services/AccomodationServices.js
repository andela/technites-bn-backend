/* eslint-disable camelcase */
import database from '../database/models';

/**
 * @class AccomodationServices
 */
class AccomodationServices {
  /**
     *
     * @param {*} newAccomodation
     * @returns {object} returns the newly saved accomodation facility
     */
  static async createAccomodation(newAccomodation) {
    const createdAccomodation = await database.Accomodations.create(newAccomodation);
    return createdAccomodation;
  }

  /**
      *
      * @param {*} accommodation_name
      * @param {*} location
      * @param {*} room_type
      * @returns {object} returns the newly saved accomodation facility
      */
  static async getByNameLocationRoom(accommodation_name, location, room_type) {
    const found = await database.Accomodations.findAll({
      where: { accommodation_name, location, room_type }
    });
    return found;
  }

  /**
 *
 * @param {*} accommodation_name
 * @param {*} location
 * @returns {*} accomodation
 */
  static async findAccommodation(accommodation_name, location) {
    const accommodation = await database.Accomodations.findOne({
      where: { accommodation_name, location }
    });
    if (!accommodation) return null;
    return accommodation.dataValues;
  }

  /**
   *
   * @param {*} accommodation_name
   * @returns {*} accommodation
   */
  static async findAccommodationByName(accommodation_name) {
    const accommodation = await database.Accomodations.findOne({
      where: { accommodation_name }
    });
    if (!accommodation) return null;
    return accommodation.dataValues;
  }

  /**
 *
 * @param {*} id
 * @returns {*} accomodation
 */
  static async findAccommodationById(id) {
    const accommodation = await database.Accomodations.findOne({
      where: { id }
    });
    if (!accommodation) return null;
    return accommodation.dataValues;
  }

  /**
 *
 * @returns {*} accommodations
 */
  static async findAllAccommodations() {
    const accommodation = await database.Accomodations.findAll();
    if (!accommodation) return null;
    return accommodation;
  }

  /**
 *
 * @param {*} location
 * @returns {*} accommodations
 */
  static async findAllAccommodationsByLocation(location) {
    const accommodation = await database.Accomodations.findAll({ where: { location } });
    if (!accommodation) return null;
    return accommodation;
  }
}

export default AccomodationServices;
