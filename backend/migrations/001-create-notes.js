import { DataTypes } from 'sequelize';

// Apply this version of the database structure.
export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('notes', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        // Sequelize generates UUID v4 in the Note model before inserting.
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, { transaction });
  });
}

// Reversing this migration would remove the table and its data.
export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('notes');
}
