import eventEmitter from '../../utils/notifications/EventEmitter';

export default (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    user_id: DataTypes.INTEGER,
    request_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['OneWay', 'ReturnTrip']],
          msg: 'Invalid Request Type use OneWay or ReturnTrip only'
        }
      }
    },
    location_id: DataTypes.INTEGER,
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
    reason: {
      type: DataTypes.STRING,
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
      as: 'user'
    });
    Request.hasMany(models.Comment, {
      foreignKey: 'request_id',
    });
  };

  Request.afterCreate(({ dataValues }) => {
    eventEmitter.emit('new_travel_request', dataValues);
  });

  Request.afterBulkUpdate(async (data) => {
    const updatedRequest = await sequelize
      .query(`SELECT "Requests".*,"Users".email,"Users".line_manager FROM "Requests", "Users" WHERE "Requests".id = ${data.where.id} AND "Users".id = "Requests".user_id`, {
        type: sequelize.QueryTypes.SELECT
      });
    eventEmitter.emit('request_update', updatedRequest[0]);
  });
  return Request;
};
