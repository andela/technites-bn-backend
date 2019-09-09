/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

export default (sequelize, DataTypes) => {
  const Password_resets = sequelize.define('Password_resets', {
    user_id: DataTypes.INTEGER,
    token: DataTypes.STRING
  }, {});
  Password_resets.associate = (models) => {
    // associations can be defined here
    Password_resets.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id',
    });
  };
  return Password_resets;
};
