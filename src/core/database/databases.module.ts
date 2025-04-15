import { DynamicModule, Module, BadRequestException, HttpStatus } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Connections, ConfigDBData } from './databases.interface';
import { ErrorResponse } from './../helpers/responses/error.response';
import { responseMsg } from '../constants/responseMsg.const';

@Module({})
export class DatabaseModule {
    private static getConnectionOptions(configDBData: ConfigDBData): TypeOrmModuleOptions {
        let connectionOptions = null;
        if (!configDBData.type) {
            throw new BadRequestException(new ErrorResponse(responseMsg.CONFIG_DB_INVALID.MESSAGE, responseMsg.CONFIG_DB_INVALID.CODE));
        }
        console.log('configDBData.type: ', configDBData.type);
        switch (configDBData.type) {
            case 'mysql':
                connectionOptions = DatabaseModule.getConnectionOptionsMysql(configDBData);
                break;
            case 'postgres':
                connectionOptions = DatabaseModule.getConnectionOptionsPostgres(configDBData);
                break;
            case 'mongodb':
                connectionOptions = DatabaseModule.getConnectionOptionsMongo(configDBData);
            default:
                connectionOptions = DatabaseModule.getConnectionOptionsMysql(configDBData);
                break;
        }
        const dataConnection = {
            ...connectionOptions,
            synchronize: false,
            logging: false,
        };
        console.log('dataConnection: ', dataConnection);
        return dataConnection;
    }

    private static getConnectionOptionsPostgres(configDBData: ConfigDBData): TypeOrmModuleOptions {
        return {
            name: configDBData.name,
            type: configDBData.type,
            url: configDBData.url,
            keepConnectionAlive: true,
            ssl: false,
            // process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test'
            // ? { rejectUnauthorized: false }
            // : false,
        };
    }

    private static getConnectionOptionsMysql(configDBData: ConfigDBData): TypeOrmModuleOptions {
        return {
            name: configDBData.name,
            type: configDBData.type,
            host: configDBData.host,
            port: configDBData.port,
            username: configDBData.username,
            password: configDBData.password,
            database: configDBData.database,
            keepConnectionAlive: true,
            ssl: false,
            autoLoadEntities: true,
            maxQueryExecutionTime: 5000,
            connectTimeout: 10000,
            extra: {
                connectionLimit: 10,
            },
            synchronize: false,
        };
    }

    private static getConnectionOptionsMongo(configDBData: ConfigDBData): TypeOrmModuleOptions {
        return {
            type: configDBData.type,
            host: configDBData.host,
            port: configDBData.port,
            username: configDBData.username,
            password: encodeURIComponent(configDBData.password),
            database: configDBData.database,
            authSource: process.env.DATABASE_DATA_SOURCE,
            synchronize: true,
            logging: false,
            autoLoadEntities: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            // connectTimeout: parseInt(process.env.DATABASE_CONNECTION_TIME_OUT),
            // acquireTimeout: parseInt(process.env.DATABASE_ACQUIRE_TIME_OUT),
            // extra: {
            //     connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT),
            // },
            // entities: ['dist/**/entity/*.entity.js'],
            // migrations: ['dist/database/migrations/*.js'],
            // cli: {
            //     entitiesDir: 'src/modules/**/entity',
            //     migrationsDir: 'src/database/migrations',
            // },
        };
    }

    public static forRoot(connections: Connections): DynamicModule {
        const DbConfigModules = [];
        for (const [key, value] of Object.entries(connections)) {
            const DbConfigModule = TypeOrmModule.forRoot(DatabaseModule.getConnectionOptions(value));
            DbConfigModules.push(DbConfigModule);
        }
        return {
            module: DatabaseModule,
            imports: DbConfigModules,
        };
    }
}
