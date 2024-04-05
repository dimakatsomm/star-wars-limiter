import 'reflect-metadata';
import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import { loadAll } from 'js-yaml';
import { JsonObject, serve, setup } from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { middleware } from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import { createClient } from 'redis';

import * as C from './constants';

const app = express();

const apiSpec = readFileSync(path.join(__dirname, '../spec/api.spec.yaml'), 'utf-8');
const swaggerDoc = loadAll(apiSpec, null, { json: true })[0] as JsonObject;

app.use(express.json());
app.use('/documentation', serve, setup(swaggerDoc));
app.use(middleware({ apiSpec: swaggerDoc as OpenAPIV3.Document, validateSecurity: true }));

mongoose.connect(C.MONGOURI).then(() => {
  console.log('Connected to Location Tracker DB.');
});

const redisClient = createClient({
  password: C.REDIS_PASSWORD,
  socket: {
    host: C.REDIS_HOST,
    port: C.REDIS_PORT,
  },
});
redisClient.on('error', (e: any) => {
  console.error(e);
});
redisClient.connect().then(() => {
  console.log('Connected to Location Tracker Redis DB.');
});

app.listen(C.PORT, () => {
  console.log(`Server running on PORT: ${C.PORT}`);
});

export { redisClient };