import { Op } from 'sequelize';
import _ from 'lodash';
import RequestServices from '../services/RequestServices';


const { searchRequests } = RequestServices;
/**
 * @class SearchUtils
 */
class SearchUtils {
  /**
       *
       * @param {*} keyWord
       * @param {*} beforeDate
       * @param {*} afterDate
       * @param {*} column
       * @returns {*} requests Array
       */
  static async searchRequestUtil(keyWord, beforeDate, afterDate, column) {
    const responseArray = [];
    // search keyword
    const keywordsArray = await SearchUtils.searchKeyWord(keyWord);
    responseArray.push(keywordsArray);
    // adds search before and after
    const beforeAfterArray = await SearchUtils.searchBeforeAndAfter(beforeDate, afterDate, column);
    responseArray.push(beforeAfterArray);
    // search before or After
    const beforeOrAfterArray = await SearchUtils.searchBeforeOrAfter(beforeDate, afterDate, column);
    responseArray.push(beforeOrAfterArray);
    // flattern 2D Array to 1D eg: [[1,2],[3,4]] -> [1,2,3,4] & remove duplicates
    return _.chain(responseArray).flatten().uniqBy('id').value();
  }

  /**
   * @func searchBeforeAndAfter
   * @param {*} beforeDate
   * @param {*} afterDate
   * @param {*} column
   * @returns {*} result array
   */
  static async searchBeforeAndAfter(beforeDate, afterDate, column) {
    const result = [];
    if (beforeDate && afterDate) {
      const columns = ['departure_date', 'createdAt'];
      if (columns.includes(column)) {
        const where = {
          [Op.and]: [{
            [column]: {
              [Op.lte]: new Date(beforeDate),
              [Op.gte]: new Date(afterDate)
            }
          }]
        };
        const resp = await searchRequests(where);
        result.push(resp);
      }
      const where = {
        [Op.and]: [{ createdAt: { [Op.lte]: new Date(beforeDate), [Op.gte]: new Date(afterDate) } },
          { departure_date: { [Op.lte]: new Date(beforeDate), [Op.gte]: new Date(afterDate) } },
        ]
      };
      const resp = await searchRequests(where);
      result.push(resp);
    }
    return _.chain(result).flatten().value();
  }

  /**
   * @func searchBeforeOrAfter
   * @param {*} beforeDate
   * @param {*} afterDate
   * @param {*} column
   * @returns {Array} response
   */
  static async searchBeforeOrAfter(beforeDate, afterDate, column) {
    const response = [];
    if (beforeDate || afterDate) {
      const columnQuery = SearchUtils.buildWhere(beforeDate, afterDate, column);
      const timeQuery = SearchUtils.buildWhere(beforeDate, afterDate);
      const where = { ...columnQuery, ...timeQuery };
      const resp = await searchRequests(where);
      response.push(resp);
    }
    return _.chain(response).flatten().value();
  }

  /**
   * @func buildWhere
   * @param {*} beforeDate
   * @param {*} afterDate
   * @param {*} column
   * @param {*} name
   * @returns {*} returns
   */
  static buildWhere(beforeDate, afterDate, column) {
    const date = beforeDate || afterDate;
    const gte = { [Op.gte]: new Date(date) };
    const lt = { [Op.lt]: new Date(date) };
    if (column === 'departure_date' || column === 'createdAt') {
      return { [Op.or]: [{ [column]: beforeDate ? lt : gte }] };
    }
    return {
      [Op.and]: [{ departure_date: beforeDate ? lt : gte }, { createdAt: beforeDate ? lt : gte }]
    };
  }

  /**
   * @func searchKeyWord
   * @param {*} keyWord
   * @returns {Array} result
   */
  static async searchKeyWord(keyWord) {
    if (keyWord) {
      const where = {
        [Op.or]: [
          { status: { [Op.iLike]: `%${keyWord}%` } },
          { reason: { [Op.iLike]: `%${keyWord}%` } },
          { request_type: { [Op.iLike]: `%${keyWord}%` } },
        ]
      };
      const keywords = await searchRequests(where);
      return keywords;
    }
    return [];
  }
}

export default SearchUtils;
