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
}

export default AccomodationServices;
