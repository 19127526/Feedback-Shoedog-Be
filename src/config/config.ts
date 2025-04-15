const Joi = require('joi');
const fs = require('fs');
const dotenv = require('dotenv');

let root = `${process.cwd()}`;

let pathENV = `${root}/.env.local`;
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
    case 'production':
        pathENV = `${root}/.env`;
        break;
    case 'staging':
        pathENV = `${root}/.env.staging`;
        break;
    case 'pilot':
        pathENV = `${root}/.env.pilot`;
        break;
    case 'development':
        pathENV = `${root}/.env.dev`;
        break;
}

console.log('pathENV: ', pathENV);

if (fs.existsSync(pathENV)) {
    // get from file env
    dotenv.config({ path: pathENV });
} else {
    console.log('DOES NOT exist:');
    // get env from config map and secret
}
// define validation for all the env vars
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().allow('development', 'staging', 'production', 'local', 'pilot').default('development'),
    APP_URL: Joi.string().required(),
    APP_HOST: Joi.string().required(),
    BASE_URL: Joi.string().required(),
    SERVER_TIMEOUT: Joi.number().required(),

    DATABASE_READ_TYPE_C: Joi.string().required(),
    DATABASE_READ_NAME_C: Joi.string().required(),
    DATABASE_READ_CONNECTION_C: Joi.string().required(),
    DATABASE_READ_HOST_C: Joi.string().required(),
    DATABASE_READ_PORT_C: Joi.string().required(),
    DATABASE_READ_USERNAME_C: Joi.string().required(),
    DATABASE_READ_PASSWORD_C: Joi.string().required(),
    DATABASE_READ_DB_NAME_C: Joi.string().required(),

    DATABASE_WRITE_TYPE_C: Joi.string().required(),
    DATABASE_WRITE_NAME_C: Joi.string().required(),
    DATABASE_WRITE_CONNECTION_C: Joi.string().required(),
    DATABASE_WRITE_HOST_C: Joi.string().required(),
    DATABASE_WRITE_PORT_C: Joi.string().required(),
    DATABASE_WRITE_USERNAME_C: Joi.string().required(),
    DATABASE_WRITE_PASSWORD_C: Joi.string().required(),
    DATABASE_WRITE_DB_NAME_C: Joi.string().required(),

})
    .unknown()
    .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const config = () => ({
    appName: 'API Socket',
    env: envVars.NODE_ENV,
    port: envVars.APP_PORT,
    appWelcome: envVars.APP_WELCOME,
    appUrl: envVars.APP_URL,
    appHost: envVars.APP_HOST,
    baseUrl: envVars.BASE_URL,

    secretJwt: envVars.SECRECT_KEY_AUTHEN_CMS,

    debugMode: envVars.DEBUG_MODE ? parseInt(envVars.DEBUG_MODE) : 0,
    ttlMemCache: envVars.TTL_MEMCACHE ? parseInt(envVars.TTL_MEMCACHE) : 60000,
    enableMonolog: envVars.ENABLE_MONOLOG ? parseInt(envVars.ENABLE_MONOLOG) : 1,
    userSwagger: envVars.USERNAME_SWAGGER,
    passSwagger: envVars.PASSWORD_SWAGGER,


    redisGateWayExpired: envVars.REDIS_GATEWAY_EXPIRED,
    redisGateWayHost: envVars.REDIS_GATEWAY_HOST,
    redisGateWayPort: envVars.REDIS_GATEWAY_PORT,
    redisGateWayPassword: envVars.REDIS_GATEWAY_PASSWORD,
    redisGateWayValue: envVars.REDIS_GATEWAY_VALUE,

    redisSocketExpired: envVars.REDIS_SOCKET_EXPIRED,
    redisSocketHost: envVars.REDIS_SOCKET_HOST,
    redisSocketPort: envVars.REDIS_SOCKET_PORT,
    redisSocketPassword: envVars.REDIS_SOCKET_PASSWORD,
    redisSocketValue: envVars.REDIS_SOCKET_VALUE,

    connectionsDB: {
        db_content_read: {
            type: envVars.DATABASE_READ_TYPE_C,
            driver: envVars.DATABASE_READ_TYPE_C,
            url: '',
            host: envVars.DATABASE_READ_HOST_C,
            port: envVars.DATABASE_READ_PORT_C,
            database: envVars.DATABASE_READ_DB_NAME_C,
            username: envVars.DATABASE_READ_USERNAME_C,
            password: envVars.DATABASE_READ_PASSWORD_C,
            name: envVars.DATABASE_READ_NAME_C,
        },
        db_content_write: {
            type: envVars.DATABASE_WRITE_TYPE_C,
            driver: envVars.DATABASE_WRITE_TYPE_C,
            url: '',
            host: envVars.DATABASE_WRITE_HOST_C,
            port: envVars.DATABASE_WRITE_PORT_C,
            database: envVars.DATABASE_WRITE_DB_NAME_C,
            username: envVars.DATABASE_WRITE_USERNAME_C,
            password: envVars.DATABASE_WRITE_PASSWORD_C,
            name: envVars.DATABASE_WRITE_NAME_C,
        },
    },


});
