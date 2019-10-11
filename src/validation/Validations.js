/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
/* eslint-disable lines-between-class-members */
/* eslint-disable require-jsdoc */
import Joi from '@hapi/joi';
import PasswordComplexity from 'joi-password-complexity';
import RequestServices from '../services/RequestServices';
import UserServices from '../services/UserServices';
import HostService from '../services/HostServices';
import AccomodationServices from '../services/AccomodationServices';
import RoomServices from '../services/RoomServices';
import LocationServices from '../services/LocationServices';
import Util from '../utils/Utils';
import AuthenticationHelper from '../utils/AuthHelper';

const { searchRequest, findRequestById } = RequestServices;
const { findUserByEmail } = UserServices;
const { findHostByEmail } = HostService;
const { comparePassword } = AuthenticationHelper;
const { findAccommodation, findAccommodationById, findAccommodations } = AccomodationServices;
const { findLocationById } = LocationServices;
const { findRoom, findRooms, checkRoomAvailability } = RoomServices;
const util = new Util();

export const genericValidator = (req, res, schema, next) => {
  const { error } = Joi.validate(req.body, schema, {
    abortEarly: false,
    convert: true,
  });
  if (error) {
    const errors = [];
    const { details: errArr = [] } = error || {};
    errArr.forEach((err) => {
      errors.push(err.message.split('"').join(''));
    });
    return res.status(400).json({
      status: res.statusCode,
      errors,
    });
  }
  return next();
};

export default class Validation {
  static resetValidator(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),
    });
    genericValidator(req, res, schema, next);
  }
  static credentialsValidator(req, res, next) {
    const complexityOptions = {
      min: 6,
      max: 30,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
    };
    const schema = Joi.object().keys({
      password: new PasswordComplexity(complexityOptions).required(),
      confirm_password: Joi.string().required()
    });
    genericValidator(req, res, schema, next);
  }
  static resetHostValidator(req, res, next) {
    const complexityOptions = {
      min: 6,
      max: 30,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
    };
    const schema = Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      old_password: Joi.required(),
      password: new PasswordComplexity(complexityOptions).required(),
      confirm_password: Joi.string().required()
    });
    genericValidator(req, res, schema, next);
  }
  static updateProfileValidator(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }),
      firstname: Joi.string().min(2).max(30),
      lastname: Joi.string().min(2).max(30),
      username: Joi.string().min(2).max(30),
      phone: Joi.string().min(9).max(10),
      gender: Joi.string().regex(/^(Male|Female|MALE|FEMALE|male|female)$/),
      dob: Joi.date(),
      address: Joi.string().min(2).max(30),
      country: Joi.string().min(2).max(30),
      language: Joi.string().min(2).max(30),
      currency: Joi.string().min(2).max(30),
      company: Joi.string().min(2).max(30),
      department: Joi.string().min(2).max(30),
      line_manager: Joi.string(),
      isEmailAllowed: Joi.boolean(),
    });
    genericValidator(req, res, schema, next);
  }
  static updateRequestValidator(req, res, next) {
    const multiCityRequest = Joi.object({
      destination_id: Joi.number().integer(),
      accomodation_id: Joi.number().integer(),
      check_in: Joi.date(),
      check_out: Joi.date(),
    });
    const schema = Joi.object().keys({
      request_type: Joi.string().regex(/^(OneWay|ReturnTrip)$/),
      location_id: Joi.number().integer().min(1),
      departure_date: Joi.date(),
      return_date: Joi.date(),
      destinations: Joi.array().items(multiCityRequest).min(1),
      reason: Joi.string().min(1).max(255),
    });
    genericValidator(req, res, schema, next);
  }
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} newUser
   */
  static validateRequest(req) {
    let schema = null;

    const multiCityRequest = Joi.object({
      destination_id: Joi.number().integer().required(),
      accomodation_id: Joi.number().integer().required(),
      check_in: Joi.date().required(),
      check_out: Joi.date().required(),
      room_id: Joi.number().integer().required(),
    });

    if (req.body.request_type === 'ReturnTrip') {
      schema = {
        request_type: Joi.string().required().min(1).max(255),
        location_id: Joi.number().integer().required().min(1),
        departure_date: Joi.date().required(),
        return_date: Joi.date().required(),
        destinations: Joi.array().items(multiCityRequest).min(1).required(),
        reason: Joi.string().required().min(1).max(255),
        passport_name: Joi.string(),
        passport_number: Joi.string(),
      };
    } else {
      schema = {
        request_type: Joi.string().required().min(1).max(255),
        location_id: Joi.number().integer().required().min(1),
        departure_date: Joi.date().required(),
        destinations: Joi.array().items(multiCityRequest).min(1).required(),
        reason: Joi.string().required().min(1).max(255),
        passport_name: Joi.string(),
        passport_number: Joi.string(),
      };
    }

    return Joi.validate(req.body, schema);
  }
  static validateAddHostFields(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      firstname: Joi.string().min(2).max(30).required(),
      lastname: Joi.string().min(2).max(30).required(),
    });
    genericValidator(req, res, schema, next);
  }
  static async validateAddHost(req, res, next) {
    // check if it is superadmin
    if (req.user.role_value !== 7) {
      util.setError(401, 'Access denied');
      return util.send(res);
    }
    // check if user exist already
    const searchUser = await findUserByEmail(req.body.email);
    if (searchUser) {
      util.setError(403, `User with email ${req.body.email} already exist`);
      return util.send(res);
    }
    next();
  }
  static async validateUpdateRequest(req, res, next) {
    // Check whether param is a valid Id
    if (isNaN(req.params.id)) {
      util.setError(403, 'Request id must be a valid Integer');
      return util.send(res);
    }
    // check whether user has added his line manager
    if (req.user.line_manager === null) {
      util.setError(403, 'Kindly edit your profile and add your line manager email');
      return util.send(res);
    }
    const searchReq = await searchRequest(req.params.id);
    // search if Request exists
    if (!searchReq) {
      util.setError(404, 'Request not found');
      return util.send(res);
    }
    // check to whom Request belongs
    if (searchReq.user_id !== req.user.id) {
      util.setError(403, 'You are not allowed to edit another user request');
      return util.send(res);
    }
    // check if request is still pending
    if (searchReq.status !== 'Pending') {
      util.setError(403, `Request is already ${searchReq.status}, you are only allowed to edit Pending requests`);
      return util.send(res);
    }
    req.userRequest = searchReq;
    next();
  }
  static async validateHostReset(req, res, next) {
    const host = await findHostByEmail(req.body.email);
    if (!host) {
      util.setError(401, `User with email ${req.body.email} not found `);
      return util.send(res);
    }
    if (host.is_verified === true) {
      util.setError(403, 'Forbidden, Host already verified');
      return util.send(res);
    }
    // Comparing passwords
    const comparePasswords = comparePassword(req.body.old_password, host.password);
    if (comparePasswords === false) {
      util.setError(409, 'Old Password Missmatch');
      return util.send(res);
    }
    if (req.body.password !== req.body.confirm_password) {
      util.setError(409, 'New Password Missmatch');
      return util.send(res);
    }
    next();
  }
  static validateHostAccommodations(req, res, next) {
    const multiServices = Joi.object({
      service: Joi.string().required(),
    });
    const multiAmenities = Joi.object({
      amenity: Joi.string().required(),
    });
    const schema = Joi.object().keys({
      accommodation_name: Joi.string().min(2).max(30).required(),
      description: Joi.string().required(),
      location: Joi.number().integer().required(),
      services: Joi.array().items(multiServices).min(1).required(),
      amenities: Joi.array().items(multiAmenities).min(1).required()
    });
    genericValidator(req, res, schema, next);
  }
  static validateRooms(req, res, next) {
    const schema = Joi.object().keys({
      accommodation_id: Joi.number().integer().required(),
      name: Joi.string().min(2).max(30).required(),
      room_type: Joi.string().regex(/^(single|double|triple|quad|queen|king|twin|studio)$/).required(),
      description: Joi.string().required(),
      cost: Joi.number().integer().min(1).required(),
      status: Joi.boolean().required()
    });
    genericValidator(req, res, schema, next);
  }
  static async validateAccommodations(req, res, next) {
    const location = await findLocationById(req.body.location);
    if (!location) {
      util.setError(404, 'Please choose an existing location');
      return util.send(res);
    }
    if (req.user.role_value !== 0) {
      util.setError(403, 'You are not allowed to access this endpoint');
      return util.send(res);
    }
    const accommodation = await findAccommodation(req.body.accommodation_name, req.body.location);
    if (accommodation) {
      util.setError(409, `The accommodation named ${req.body.accommodation_name} already exists in that location`);
      return util.send(res);
    }
    if (req.files.images.length === undefined) {
      util.setError(403, 'Please Upload more pictures');
      return util.send(res);
    }
    if (typeof req.body.services === 'string') {
      req.body.services = JSON.parse(req.body.services);
    }
    if (typeof req.body.amenities === 'string') {
      req.body.amenities = JSON.parse(req.body.amenities);
    }
    next();
  }
  static async validateNewRoom(req, res, next) {
    const accommodation = await findAccommodationById(req.body.accommodation_id);
    if (!accommodation) {
      util.setError(404, 'Accommodation does not exist');
      return util.send(res);
    }
    const room = await findRoom(
      req.body.accommodation_id,
      req.body.name,
      req.body.room_type,
      req.body.description
    );
    if (room) {
      util.setError(409, `Room name ${req.body.name}, with the type ${req.body.room_type} already exists at ${accommodation.accommodation_name}`);
      return util.send(res);
    }
    if (req.user.id !== accommodation.owner) {
      util.setError(403, 'You are not allowed to add rooms to an accommodation you do not own');
      return util.send(res);
    }
    if (req.user.role_value === 1) {
      util.setError(403, 'You are not allowed to access this endpoint');
      return util.send(res);
    }
    if (req.files.images.length === undefined) {
      util.setError(403, 'Please Upload more pictures');
      return util.send(res);
    }
    next();
  }
  static async validateLike(req, res, next) {
    if (isNaN(req.params.id)) {
      util.setError(400, 'Accommodation id must be a valid Integer');
      return util.send(res);
    }
    // accommodation exist
    const accommodation = await findAccommodationById(req.params.id);
    if (!accommodation) {
      util.setError(404, 'Accommodation does not exist');
      return util.send(res);
    }
    next();
  }
  static validateRating(req, res, next) {
    const schema = Joi.object().keys({
      rating: Joi.number().integer().valid([1, 2, 3, 4, 5]).required(),
    });
    genericValidator(req, res, schema, next);
  }
  static async validateNewRequest(req, res, next) {
    const request = req.body;
    if (typeof request.destinations === 'string') {
      request.destinations = JSON.parse(request.destinations);
    }

    // check accommodation if exists
    const accommodations = request.destinations.map((destination) => destination.accomodation_id);
    const findAcc = await findAccommodations(accommodations);

    if (accommodations.length !== findAcc.length) return res.status(404).json({ status: res.statusCode, error: 'Please fill in existing accommodations' });

    // check if accommodation exist in that location
    const requestLocations = request.destinations.map((destination) => destination.destination_id);
    const accLocations = findAcc.map((accommodation) => accommodation.location);
    if (requestLocations.sort().toString() !== accLocations.sort().toString()) return res.status(401).json({ status: res.statusCode, error: 'The Accommodations you picked do not belong to the location specified' });

    // check rooms in that accommodation
    const noAvailableSpace = [];
    findAcc
      .map(({ id, accommodation_name, available_space }) => ({ id, accommodation_name, available_space }))
      .forEach((room) => (room.available_space === 0 ? noAvailableSpace.push(room.accommodation_name) : 1));
    if (noAvailableSpace.length !== 0) return res.status(404).json({ status: res.statusCode, error: 'The following accommodations have no available space at this time, Change your choice', noAvailableSpace });

    // search Room based  on accommodations provided by the user and if it is available
    const searchRooms = await findRooms(accommodations);

    // mapping rooms ids from search
    const availableRooms = searchRooms.map((room) => room.id);

    // mapping requested rooms ids
    const requestedRooms = request.destinations.map((destination) => destination.room_id);

    // checking rooms requested by user if they are valid
    const checkRooms = requestedRooms.every((requestedRoom) => availableRooms.includes(requestedRoom));
    if (checkRooms !== true) return res.status(404).json({ status: res.statusCode, error: 'The rooms you are choosing are not available' });
    // checking if room is not occupied during certain period
    const dates = request.destinations.map(({ room_id, check_in, check_out }) => ({ room_id, check_in, check_out }));
    const checkRoomDates = await Promise.all(dates.map(({ room_id, check_in, check_out }) => checkRoomAvailability(room_id, check_in, check_out)));
    const count = [].concat(...checkRoomDates);
    if (count.length !== 0) {
      return res.status(409).json({
        status: res.statusCode,
        message: 'Room occupied during that period please change dates'
      });
    }

    req.accommodations = accommodations;
    req.requestedRooms = requestedRooms;
    next();
  }
  static async validateRequestAdmin(req, res, next) {
    const userRequest = await findRequestById(req.params.id);
    if (!userRequest) {
      return res.status(404).json({
        status: res.statusCode,
        message: 'The request with the given id does not exist'
      });
    }
    if (userRequest.status !== 'Pending') {
      return res.status(401).json({
        status: res.statusCode,
        message: 'The request with the given id has already been responded to'
      });
    }
    next();
  }
}
