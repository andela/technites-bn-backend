/* eslint-disable no-unused-vars */
export default (sequelize, DataTypes) => {
  const Accomodations = sequelize.define('Accomodations', {
    accommodation_name: DataTypes.STRING,
    room_type: DataTypes.STRING,
    description: DataTypes.STRING,
    location: DataTypes.STRING,
    images: DataTypes.JSONB,
    quantity: DataTypes.INTEGER
  }, {});
  Accomodations.associate = (models) => {
    // associations can be defined here
  };
  return Accomodations;
};
