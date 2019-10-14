export default (sequelize, DataTypes) => {
  const Bookings = sequelize.define('Bookings', {
    request_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
    check_in: DataTypes.DATE,
    check_out: DataTypes.DATE,
    status: DataTypes.BOOLEAN
  }, {});
  Bookings.associate = (models) => {
    // associations can be defined here
    Bookings.belongsTo(models.Request, {
      onDelete: 'CASCADE',
      foreignKey: 'request_id',
    });
    Bookings.belongsTo(models.Room, {
      onDelete: 'CASCADE',
      foreignKey: 'room_id',
    });
  };
  return Bookings;
};
