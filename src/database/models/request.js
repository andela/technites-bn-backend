export default (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    user_id: DataTypes.INTEGER,
    departure: DataTypes.INTEGER,
    departure_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    return_date: DataTypes.STRING,
    destinations: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pending',
      validate: {
        isIn: {
          args: [['Pending', 'Approved', 'Rejected']],
          msg: 'Invalid Status uses Pending,Approved or Rejected only'
        }
      }
    }
  }, {});
  Request.associate = (models) => {
    // associations can be defined here
    Request.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
  };
  return Request;
};
