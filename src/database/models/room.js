/* eslint-disable no-unused-vars */
export default (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    accommodation_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    room_type: DataTypes.STRING,
    description: DataTypes.STRING,
    cost: DataTypes.INTEGER,
    images: DataTypes.JSONB,
    status: DataTypes.BOOLEAN
  }, {});
  Room.associate = (models) => {
    // associations can be defined here
    Room.belongsTo(models.Accomodations, {
      onDelete: 'CASCADE',
      foreignKey: 'accommodation_id',
    });
  };
  return Room;
};
