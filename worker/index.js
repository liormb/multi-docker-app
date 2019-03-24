import keys from './keys';
import redis from 'redis';
import fibonacci from './fibonacci';

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
});

const subscription = redisClient.duplicate();

subscription.on('message', (channel, message) => {
    redisClient.hset('values', message, fibonacci(parseInt(message)));
});

subscription.subscribe('insert');
