/* eslint-disable no-unused-vars */

export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    role: DataTypes.STRING,
    role_value: DataTypes.INTEGER
  }, {});
  Role.associate = (models) => {
    // associations can be defined here
  };
  return Role;
};
