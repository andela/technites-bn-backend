export default (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    feedback: {
      type: DataTypes.TEXT
    },
    user_id: DataTypes.INTEGER,
    accommodation_id: DataTypes.INTEGER,
  }, {});
  Feedback.associate = (models) => {
    // associations can be defined here
    Feedback.belongsTo(models.Accomodations, {
      foreignKey: 'accommodation_id'
    });

    Feedback.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };
  return Feedback;
};
