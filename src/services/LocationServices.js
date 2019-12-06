import database from '../database/models';
/**
 * @class LocationService
 */
class LocationService {
  /**
   *
   * @param {*} location
   * @returns {object} returns new location
   */
  static async addLocation(location) {
    const newLocation = await database.location.create(location);
    return newLocation;
  }

  /**
   *
   * @param {*} id
   * @returns {*} accomodation
   */
  static async findLocationById(id) {
    const location = await database.location.findOne({
      where: { id }
    });
    if (!location) return null;
    return location.dataValues;
  }

  /**
   *
   * @param {*} id
   * @returns {*} accomodation
   */
  static async getAllLocations() {
    const locations = await database.location.findAll();
    if (!locations) return null;
    return locations;
  }
}
export default LocationService;
