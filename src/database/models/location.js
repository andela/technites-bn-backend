export default (sequelize, DataTypes) => {
  const location = sequelize.define('location', {
    name: DataTypes.STRING
  }, {});
  // eslint-disable-next-line no-unused-vars
  location.associate = (models) => {
    // associations can be defined here
  };
  return location;
};
