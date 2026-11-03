import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/dbConnect.util.js';

// The pair of IDs identifies a relationship; no additional ID is needed.
const noteTagsModel = sequelize.define('NoteTag', {
  noteId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: { model: 'notes', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  tagId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: { model: 'tags', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'note_tags',
  timestamps: false,
});

export default noteTagsModel;
