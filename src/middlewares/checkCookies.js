import UserServices from '../services/UserServices';

const { isAutoFill } = UserServices;

export default async (req, res, next) => {
  if (await isAutoFill(req.user.email)) {
    const { passport_name: passportName, passport_number: passportNumber } = req.cookies;

    if (passportName !== undefined && passportNumber !== undefined) {
      req.body.passport_name = passportName;
      req.body.passport_number = passportNumber;
    }
  }
  next();
};
