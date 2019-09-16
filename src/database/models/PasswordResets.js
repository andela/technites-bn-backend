/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

export default (sequelize, DataTypes) => {
  const PasswordResets = sequelize.define('PasswordResets', {
    user_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    valid: DataTypes.BOOLEAN
  }, {});
  PasswordResets.associate = (models) => {
    // associations can be defined here
    PasswordResets.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id',
    });
  };
  return PasswordResets;
};
