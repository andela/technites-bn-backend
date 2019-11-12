import UserServices from '../services/UserServices';

const { isAutoFill, getUserLastRequest } = UserServices;

export default async (req, res, next) => {
  if (await isAutoFill(req.user.email)) {
    const last = await getUserLastRequest(req.user.id);
    if (last !== null) {
      req.body.passport_name = last.dataValues.passport_name;
      req.body.passport_number = String(last.dataValues.passport_number);
    }
  }
  next();
};
