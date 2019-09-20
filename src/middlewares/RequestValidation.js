import Validation from '../validation/Validations';

const { validateRequest } = Validation;

export default (req, res, next) => {
  if (req.body.request_type !== 'OneWay' && req.body.request_type !== 'ReturnTrip') {
    return res.status('404').json({ status: res.statusCode, error: 'request_type field, please use OneWay or ReturnTrip. Note that It\'s case sensitive' });
  }

  const { error } = validateRequest(req);
  if (error) return res.status(400).json({ status: '400', error: error.details[0].message });

  next();
};
