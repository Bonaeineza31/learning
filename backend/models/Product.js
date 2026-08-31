import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  createdByUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdByName: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  createdByEmail: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
}, {
  tableName: 'products',
  timestamps: true,
});

export default Product;
