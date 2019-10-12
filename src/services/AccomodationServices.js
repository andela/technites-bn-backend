/* eslint-disable camelcase */
import Sequelize, { Op } from 'sequelize';
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
      * @returns {object} returns the newly saved accomodation facility
      */
      static async getByNameLocation(accommodation_name, location) {
        const found = await database.Accomodations.findAll({
          where: {
            [Op.and]: [
              { accommodation_name: { [Op.iLike]: `%${accommodation_name}%` } },
              { location: { [Op.iLike]: `%${location}%` } },
            ]
          }
        });
        return found.map((result) => result.dataValues);
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
   * @param {*} id
   * @returns {*} accomodation
   */
  static async findAccommodationFeedback(id) {
    const accommodation = await database.Accomodations.findOne({
      where: { id },
      include: [{
        model: database.Feedback,
        required: false
      }]
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

  /**
   *
   * @param {*} accommodationIds
   * @returns {*} accommodations
   */
  static async findAccommodations(accommodationIds) {
    return database.Accomodations.findAll({
      where: { id: { [Op.in]: accommodationIds } }
    });
  }

  /**
   *
   * @param {*} accommodationId
   * @param {*} sign
   * @returns {*} bookedAccommodation
   */
  static async updateAccommodations(accommodationId, sign) {
    const accommodations = await database.Accomodations.update({ available_space: Sequelize.literal(`available_space ${sign} 1`) }, { where: { id: accommodationId } });
    return accommodations;
  }
}

export default AccomodationServices;
