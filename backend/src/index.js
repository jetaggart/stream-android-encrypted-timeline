import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import { requireAuthHeader, authenticate, users } from "./controllers/users";
import { streamFeedCredentials } from "./controllers/stream-feed-credentials";
import { virgilCredentials } from './controllers/virgil-credentials';

dotenv.config();

const app = express();

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/users", authenticate);
app.get("/users", requireAuthHeader, users)
app.post("/stream-feed-credentials", requireAuthHeader, streamFeedCredentials);
app.post("/virgil-credentials", requireAuthHeader, virgilCredentials);


app.listen(process.env.PORT, error => {
  if (error) {
    console.warn(error);
    process.exit(1);
  }

  console.info(
    `Running on port ${process.env.PORT} in ${
      process.env.NODE_ENV
    } mode.`
  );
});
