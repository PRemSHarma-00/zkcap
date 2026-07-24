import express from 'express';
import cors from 'cors';
import { settings } from './core/config';
import apiRouter from './api/routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(settings.apiV1Str, apiRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`${settings.appName} listening on port ${port}`);
});
