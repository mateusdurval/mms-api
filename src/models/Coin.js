module.exports = (sequelize, DataTypes) => {
  const Coin = sequelize.define('Coin', {
    pair: DataTypes.STRING,
    mms_20: DataTypes.DOUBLE,
    mms_50: DataTypes.DOUBLE,
    mms_200: DataTypes.DOUBLE,
    mms_200: DataTypes.DOUBLE,
    timestamp: DataTypes.DATE,
  }, {
    tableName: 'coins',
    freezeTableName: true,
    timestamps: false
  })
  return Coin
}