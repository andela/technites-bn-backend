export default (sequelize, DataTypes) => {
  const Chats = sequelize.define('Chats', {
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {});
  Chats.associate = (models) => {
    // associations can be defined here
    Chats.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'from',
    });
  };
  return Chats;
};
