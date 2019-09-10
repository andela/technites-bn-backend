export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  // eslint-disable-next-line no-unused-vars
  User.associate = (models) => {
    // associations can be defined here
  };
  return User;
};
