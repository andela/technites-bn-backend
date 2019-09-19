export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    role_value: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    dob: DataTypes.DATE,
    address: DataTypes.STRING,
    country: DataTypes.STRING,
    language: DataTypes.STRING,
    currency: DataTypes.STRING,
    image_url: DataTypes.STRING,
    company: DataTypes.STRING,
    department: DataTypes.STRING,
    line_manager: DataTypes.STRING
  }, {});
  // eslint-disable-next-line no-unused-vars
  User.associate = (models) => {
    // associations can be defined here
    User.hasMany(models.PasswordResets, {
      foreignKey: 'user_id',
    });
  };
  return User;
};
