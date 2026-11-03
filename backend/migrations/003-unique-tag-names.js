// Enforce name uniqueness regardless of capitalization or surrounding spaces.
// If existing data has duplicates, this fails without deleting or merging tags.
export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'CREATE UNIQUE INDEX tags_name_normalized_unique ON tags (lower(btrim(name)))'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeIndex('tags', 'tags_name_normalized_unique');
}
