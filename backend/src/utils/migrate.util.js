import { Umzug, SequelizeStorage } from 'umzug';
import dbConnect, { sequelize } from './dbConnect.util.js';
import * as createNotes from '../../migrations/001-create-notes.js';
import * as createTags from '../../migrations/002-create-tags.js';
import * as uniqueTagNames from '../../migrations/003-unique-tag-names.js';

// SequelizeMeta records which migrations have already been applied.
const migrator = new Umzug({
  migrations: [
    { name: '001-create-notes', ...createNotes },
    { name: '002-create-tags', ...createTags },
    { name: '003-unique-tag-names', ...uniqueTagNames },
  ],
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

try {
  await dbConnect();
  const applied = await migrator.up();
  console.log(applied.length ? 'Database migrations applied.' : 'Database is already up to date.');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
