import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/dbConnect.util.js';

const tagsModel = sequelize.define('Tag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: true },
  },
}, {
  tableName: 'tags',
});

export default tagsModel;
