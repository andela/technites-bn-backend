import Validation from '../validation/Validations';

const { validateRequest } = Validation;

export default (req, res, next) => {
  // check whether user has added his line manager
  if (req.user.line_manager === null) {
    return res.status(400).json({ status: res.statusCode, error: 'Kindly edit your profile and add your line manager email' });
  }

  if (req.body.request_type !== 'OneWay' && req.body.request_type !== 'ReturnTrip') {
    return res.status('404').json({ status: res.statusCode, error: 'Please use OneWay or ReturnTrip for request_type field. Note that It\'s case sensitive' });
  }

  const { error } = validateRequest(req);
  if (error) return res.status(400).json({ status: '400', error: error.details[0].message });

  next();
};
