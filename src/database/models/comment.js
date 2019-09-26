
export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    request_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    active: DataTypes.BOOLEAN
  }, {});
  Comment.associate = (models) => {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
    Comment.belongsTo(models.Request, {
      foreignKey: 'request_id',
    });
  };
  return Comment;
};
