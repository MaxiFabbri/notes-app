import notesModel from './Note.js';
import tagsModel from './Tag.js';
import noteTagsModel from './NoteTag.js';

// Declare associations here so individual models do not import each other.
notesModel.belongsToMany(tagsModel, {
  through: noteTagsModel,
  foreignKey: 'noteId',
  otherKey: 'tagId',
  as: 'tags',
});
tagsModel.belongsToMany(notesModel, {
  through: noteTagsModel,
  foreignKey: 'tagId',
  otherKey: 'noteId',
  as: 'notes',
});

// Import models from this file when using their associations.
export { notesModel, tagsModel, noteTagsModel };
