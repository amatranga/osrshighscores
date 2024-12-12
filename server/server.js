import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router } from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});