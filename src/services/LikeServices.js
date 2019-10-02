import database from '../database/models';
/**
 * @class LikeService
 */
class LikeService {
  /**
     *
     * @param {*} like
     * @returns {*} like
     */
  static async addLike(like) {
    const newLike = await database.Likes.create(like);
    return newLike;
  }

  /**
 *
 * @param {*} accommodationId
 * @param {*} userId
 * @param {*} status
 * @returns {*} removed like
 */
  static async updateLike(accommodationId, userId, status) {
    await database.Likes.update(status, {
      where:
        { accommodation_id: accommodationId, user_id: userId }
    });
    return status;
  }

  /**
   *
   * @param {*} accommodationId
   * @returns {*} amount of likes
   */
  static async countLikes(accommodationId) {
    const likes = database.Likes.count({ where: { accommodation_id: accommodationId, status: 'true' } });
    return likes;
  }

  /**
   *
   * @param {*} accommodationId
   * @param {*} userId
   * @returns {*} like
   */
  static async findLike(accommodationId, userId) {
    const like = await database.Likes.findOne({
      where: { accommodation_id: accommodationId, user_id: userId }
    });
    if (!like) return null;
    return like.dataValues;
  }
}
export default LikeService;
