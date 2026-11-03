import express from 'express';
import cors from 'cors';
import { notFound, handleError } from './middleware/errorHandlers.js';
import startupErrorMessage from './utils/startupError.util.js';
import notesRouter from './routes/notes.js';
import tagsRouter from './routes/tags.js';
import notesTagsRouter from './routes/notesTags.js';
import dbConnect, { sequelize } from './utils/dbConnect.util.js';

const app = express();
const port = Number(process.env.PORT || 8080);

// Allow requests from our frontend and read JSON request bodies.
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Delegate note endpoints to their router.
app.use('/api/notes', notesRouter);
app.use('/api/notes', notesTagsRouter);
app.use('/api/tags', tagsRouter);

// A simple endpoint to check that the server is running.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// These handlers must come after all routes.
app.use(notFound);
app.use(handleError);

try {
  // Accept HTTP requests only after the database connection succeeds.
  await dbConnect();
  await new Promise((resolve, reject) => {
    const server = app.listen(port, error => {
      if (error) reject(error);
      else resolve();
    });
    server.once('error', reject);
  });
  console.log(`Server running at http://localhost:${port}`);
} catch (error) {
  console.error('Server could not start:', startupErrorMessage(error));
  await sequelize.close();
  process.exitCode = 1;
}
