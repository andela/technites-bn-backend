/* eslint-disable no-unused-vars */
export default (sequelize, DataTypes) => {
  const Accomodations = sequelize.define('Accomodations', {
    accommodation_name: DataTypes.STRING,
    room_type: DataTypes.STRING,
    description: DataTypes.STRING,
    location: DataTypes.STRING,
    images: DataTypes.JSONB,
    quantity: DataTypes.INTEGER,
    services: DataTypes.JSONB,
    amenities: DataTypes.JSONB,
    available_space: DataTypes.INTEGER,
    owner: DataTypes.INTEGER
  }, {});
  Accomodations.associate = (models) => {
    // associations can be defined here
    Accomodations.hasMany(models.Rating, {
      foreignKey: 'accommodation_id',
      as: 'ratings'
    });
    Accomodations.hasMany(models.Room, {
      foreignKey: 'accommodation_id',
    });
    Accomodations.hasMany(models.Likes, {
      foreignKey: 'accommodation_id',
    });
    Accomodations.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'owner',
    });
  };
  return Accomodations;
};
