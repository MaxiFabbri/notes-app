import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('tags', {
      id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    }, { transaction });

    await queryInterface.createTable('note_tags', {
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
    }, { transaction });
    await queryInterface.addIndex('note_tags', ['tagId'], {
      name: 'note_tags_tag_id', transaction,
    });
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('note_tags', { transaction });
    await queryInterface.dropTable('tags', { transaction });
  });
}
