'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      trip.belongsTo(models.user,{
        as: "employee",
        foreignKey: {
          name: "idEmployee"
        }
      }),
      trip.belongsTo(models.country,{
        as: "country",
        foreignKey: {
          name: "idCountry"
        }
      })

    }
  };
  trip.init({
    title: DataTypes.STRING,
    idEmployee: DataTypes.INTEGER,
    idCountry: DataTypes.INTEGER,
    accomodation: DataTypes.STRING,
    transportation: DataTypes.STRING,
    duration: DataTypes.STRING,
    dateTrip: DataTypes.DATE,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'trip',
  });
  return trip;
};