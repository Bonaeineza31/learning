import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Auth = sequelize.define('Auth', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'standard'),
    allowNull: false,
    defaultValue: 'standard',
  },
}, {
  tableName: 'auths',
  timestamps: true,
});

export default Auth;
