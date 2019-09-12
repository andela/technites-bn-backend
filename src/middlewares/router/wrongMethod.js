// eslint-disable-next-line no-unused-vars
const wrongMethod = async (req, res, next) => {
  res.status(405).send({ status: 405, message: `${req.method} method is not allowed on this route` });
};

export default wrongMethod;
