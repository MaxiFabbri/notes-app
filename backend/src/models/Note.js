import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/dbConnect.util.js';

// Describe the notes table. Defining a model does not create the table.
const notesModel = sequelize.define('Note', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'notes',
});

export default notesModel;
