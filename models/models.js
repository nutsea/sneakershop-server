const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const Item = sequelize.define('items', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: false },
    brand: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    sale: { type: DataTypes.FLOAT },
    count: { type: DataTypes.INTEGER },
    size_eu: { type: DataTypes.FLOAT },
    size_ru: { type: DataTypes.FLOAT },
    size_us: { type: DataTypes.FLOAT },
    size_uk: { type: DataTypes.FLOAT },
    size_sm: { type: DataTypes.FLOAT },
    size_clo: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING, allowNull: false },
    sub_category: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING },
    color: { type: DataTypes.STRING },
    img: { type: DataTypes.STRING },
    tags: { type: DataTypes.TEXT }
})

const Image = sequelize.define('images', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    item_id: { type: DataTypes.STRING }
})

module.exports = {
    Item,
    Image
}