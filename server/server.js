import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { router } from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const currentDirectory = path.resolve(__dirname);
const buildDirectory = path.resolve(currentDirectory, '..', 'build');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(buildDirectory));

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
