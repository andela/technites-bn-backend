export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      from: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      to: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Request',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false
      },
      seen: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {});
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'to',
      as: 'receiver'
    });
  };
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'from',
      as: 'sender'
    });
  };
  return Notification;
};
