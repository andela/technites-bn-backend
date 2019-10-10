/* eslint-disable camelcase */
import Sequelize, { Op } from 'sequelize';
import database from '../database/models';

/**
 * @class RoomService
 */
class RoomService {
  /**
     *
     * @param {*} room
     * @returns {object} returns new room
     */
  static async addRoom(room) {
    const newRoom = await database.Room.create(room);
    await database.Accomodations.update({ available_space: Sequelize.literal('available_space + 1') }, { where: { id: room.accommodation_id } });
    return newRoom;
  }

  /**
   *
   * @param {*} id
   * @returns {*} room
   */
  static async findRoomById(id) {
    const room = await database.Room.findOne({ where: { id } });
    if (!room) return null;
    return room.dataValues;
  }

  /**
 *
 * @param {*} accomodationId
 * @returns {*} rooms
 */
  static async getAllRoomsByAccommodation(accomodationId) {
    const room = await database.Room.findAll({ where: { accommodation_id: accomodationId } });
    if (!room) return null;
    return room;
  }

  /**
 *
 * @param {*} accommodation_id
 * @param {*} name
 * @param {*} room_type
 * @param {*} description
 * @returns {*} room
 */
  static async findRoom(accommodation_id, name, room_type, description) {
    const room = await database.Room.findOne({
      where: {
        accommodation_id, name, room_type, description
      }
    });
    if (!room) return null;
    return room.dataValues;
  }

  /**
   *
   * @param {*} accommodationIds
   * @returns {*} accommodations
   */
  static async findRooms(accommodationIds) {
    return database.Room.findAll({
      where: { accommodation_id: { [Op.in]: accommodationIds }, status: true }
    });
  }

  /**
   *
   * @param {*} roomId
   * @param {*} status
   * @returns {*} updatedroom
   */
  static async changeRoomStatus(roomId, status) {
    const rooms = await database.Room.update({ status }, { where: { id: roomId } });
    return rooms;
  }
}

export default RoomService;
