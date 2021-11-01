'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transaction.belongsTo(models.user,{
        as: "user",
        foreignKey: {
          name: "idUser"
        }
      }),
      transaction.belongsTo(models.trip,{
        as: "trip",
        foreignKey: {
          name: "idTrip"
        }
      })
      
    }
  };
  transaction.init({
    idUser: DataTypes.INTEGER,
    idTrip: DataTypes.INTEGER,
    dateTrip: DataTypes.DATE,
    bookingDate: DataTypes.DATE,
    qty: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    status: DataTypes.STRING,
    attachment: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};