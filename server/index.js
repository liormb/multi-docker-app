require('@babel/register');
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import redis from 'redis';
import { Pool } from 'pg';
import keys from './keys';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
    user: keys.postgresUser,
    host: keys.postgresHost,
    port: keys.postgresPort,
    database: keys.postgresDatabase,
    password: keys.postgresPassword,
});

pgClient.on('error', () => console.log('Lost Postgres connection'));

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(console.log);

const redisClient = new redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
});
    
const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
    res.send('<h1>Hello Server</h1>');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const { index } = req.body;

    if (parseInt(index, 10) > 40) {
        return res.status(422).send('Index too high');
    }
    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true });
});

app.listen(5000, () => {
    console.log('Server is listening on port 5000');
});
