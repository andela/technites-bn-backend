
export default (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    user_id: DataTypes.INTEGER,
    accommodation_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER
  }, {});
  Rating.associate = (models) => {
    Rating.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'owner'
    });
  };
  return Rating;
};
