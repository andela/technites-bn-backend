/* eslint-disable no-unused-vars */
export default (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {
    user_id: DataTypes.INTEGER,
    accommodation_id: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {});
  Likes.associate = (models) => {
    // associations can be defined here
    Likes.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id',
    });
    Likes.belongsTo(models.Accomodations, {
      onDelete: 'CASCADE',
      foreignKey: 'accommodation_id',
    });
  };
  return Likes;
};
