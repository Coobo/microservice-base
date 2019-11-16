import {
  Application,
  RequestHandler,
  Router,
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import mongoose, {
  Connection,
  ConnectionOptions,
  Model,
  Mongoose,
  Document,
} from 'mongoose';
import { Logger } from 'pino';
import Bull from 'bull';
import { Root, StringSchema, Schema as HapiSchema } from '@hapi/joi';
import { Chance } from 'chance';
import uuid from 'uuid/v4';

export as namespace Base;

declare namespace Fake {
  interface fake extends Chance.Chance {
    /** Generates a random cnpj. */
    cnpj(punctuation?: boolean): string;
    /** Generates a random cpf. */
    cpf(punctuation?: boolean): string;
  }
}

declare namespace Validator {
  interface validator extends Root {
    /** Validates a cnpj. */
    cnpj(): StringSchema;

    /** Validates a cpf. */
    cpf(): StringSchema;
  }
}

declare namespace Env {
  interface env {
    /** The path to .env file */
    _envPath: string;
    /** The path to .env.test file */
    _testEnvPath: string;

    /**
     * Get value for a key from the process.env. Since `process.env` object stores all
     * values as strings, this method will cast them to their counterpart datatypes.
     *
     * | Value | Casted value |
     * |------|---------------|
     * | 'true' | true |
     * | '1' | true |
     * | 'on' | true |
     * | 'false' | false |
     * | '0' | false |
     * | 'off' | false |
     * | 'null' | null |
     *
     * Everything else is returned as a string.
     *
     * A default value can also be defined which is returned when original value
     * is undefined.
     *
     * @example
     * ```ts
     * Env.get('PORT', 3333)
     * ```
     */
    get(key: string, defaultValue?: string | boolean | null | undefined): any;

    /**
     * The method is similar to it's counter part [[get]] method. However, it will
     * raise exception when the original value is non-existing.
     *
     * `undefined`, `null` and `empty strings` are considered as non-exisitng values.
     *
     * We recommended using this method for **environment variables** that are strongly
     * required to run the application stably.
     *
     * @example
     * ```ts
     * Env.getOrFail('PORT', 3333)
     * ```
     */
    getOrFail(
      key: string,
      defaultValue?: string | boolean | null | undefined,
    ): any;

    /**
     * Update or set value for a given property
     * inside `process.env`.
     *
     * @example
     * ```ts
     * Env.set('PORT', 3333)
     * ```
     */
    set(key: string, value: any): void;

    /**
     * Process a string with .env definitions.
     */
    process(envContents: string, overwrite?: boolean): void;

    /**
     * Casts the string value to their native data type.
     */
    _castValue(value: string): string | boolean | null | undefined;

    /**
     * Initializes Env and processes env files
     */
    init(): typeof env;
  }
}

declare namespace Config {
  interface config {
    /**
     * An array with all configuration objects available.
     */
    _config: object[];

    /**
     * Reference to the Env Object.
     */
    _env: Env.env;

    /**
     * Gets a configuration or returns a defaultValue if the requests config is
     * not available.
     */
    get(key: string, defaultValue?: any): any;

    /**
     * Merges a configuration key with default values using a customizer.
     */
    merge(key: string, defaultValues?: object, customizer?: Function): any;

    /**
     * Sets a configuration.
     */
    set(key: string, value: any): void;

    /**
     * Sets a configuration merging it with previously set values.
     */
    defaults(key: string, value: any): void;
  }
}

declare namespace Server {
  interface server {
    _express: Express;
    _compression(): void;
    _security(): void;
    _proxy(): void;
    _statusRoute(): void;
    _cors(): void;
    _parsers(): void;
    _exceptionHandler(): void;
    _board(): void;
    use(...middlewares: RequestHandler[]): void;
    init(): void;
    boot(): void;
    openRouter(): Router;
    useRouter(...params: Array<Router | string>): void;
  }
}

declare namespace Db {
  interface ModelTMap {
    [key: string]: typeof Model;
  }

  interface db {
    _connection: Mongoose;
    _uri: string;
    _options: ConnectionOptions;
    models: ModelTMap;
    mongoose: typeof mongoose;

    connect(): void;
    get(name: string): typeof Model;
    add(model: typeof Model, name?: string): typeof Model;
    has(name: string): boolean;
    load(modelPath: string, name?: string): void;
  }
}

declare namespace Queue {
  interface Queue {
    key: string;
    handle(data: Bull.Job): null;
    name?: string;
    bull?: Bull.Queue;
    options?: Bull.JobOptions;
  }

  interface QueueMap {
    [key: string]: Queue;
  }

  interface queue {
    _queues: QueueMap;
    _redisConfig: object;
    queuesArray: Bull.Queue[];
    queue(queue: Queue): typeof queue;
    init(): void;
    process(): void;
    add(key: string, data: object, options: Bull.JobOptions): Bull.JobPromise;
  }
}

declare namespace App {
  interface app {
    root: string;
    folder: string;
    env: string;
    inTest: boolean;
    inProd: boolean;
    inStage: boolean;
    inDev: boolean;
    name: string;
    package: object;
    version: string;
    coreVersion: string | undefined;
    domainsPath: string;

    path(...paths: string[]): string;
    load(): void;
    boot(): Server.server;
  }
}

declare namespace Factory {
  function blueprintCallback(
    fake: Fake.fake,
    index: number,
    data: object,
  ): object;

  interface Blueprint {
    name: string;
    callback: typeof blueprintCallback;
  }

  interface BlueprintInterface {
    new (
      dataCallback: typeof blueprintCallback,
      fake: Fake.fake,
    ): BlueprintInterface;
    dataCallback: typeof blueprintCallback;
    fake: Fake.fake;

    makeOne(index: number, data: object): Promise<object>;
  }

  interface BlueprintModel extends BlueprintInterface {
    new (blueprint: Blueprint, fake: Fake.fake, db: Db.db): BlueprintModel;
    Model: string;
    db: Db.db;

    getModel(): typeof Model;
    instantiateModel(attributes: object): typeof Document.prototype;
    make(data?: object, index?: number): Promise<typeof Document.prototype>;
    makeMany(
      instances: number,
      data?: object,
    ): Promise<typeof Document.prototype[]>;
    create(data?: object, index?: number): Promise<typeof Document.prototype>;
    createMany(
      instances: number,
      data?: object,
    ): Promise<typeof Document.prototype[]>;
    reset(): Promise<any>;
  }

  interface factory {
    blueprints: Blueprint[];
    db: Db.db;
    fake: Fake.fake;

    getNameString(nameOrModel: typeof Model | string): string;
    blueprint(
      nameOrModel: typeof Model | string,
      callback: typeof blueprintCallback,
    ): typeof factory;
    getBlueprint(nameOrModel: typeof Model | string): Blueprint;
    model(nameOrModel: typeof Model | string): BlueprintModel;
    clear(): void;
  }
}

interface requireAllOptions {
  /** The path to the directory. */
  dirname: string;
  /** Regular Expression used to decide wich directories to ignore. */
  excludeDirs?: RegExp;
  /** Regular Expression used to decide wich files to import and to retrieve the module name. */
  filter?: RegExp;
  /** If set to true, requireAll will look in all subdirectories inside dirname. */
  recursive?: boolean;
  /** The function that will be used to resolve the module after beign required. */
  resolve?: (requiredModule: any, filePath: string) => any;
  /** A map function that will be used to generate the module name. */
  map?: (name: string, filePath: string) => any;
  /** If set to true, the dirname does not need to exist. */
  optional?: boolean;
}

export const app: App.app;
export const appRoot: string;
export function boot(): Server.server;
export function capitalizeString(str: string, lowercaseRest: boolean): string;
export const config: Config.config;
export const db: Db.db;
export function dbUri(
  host: string,
  port: string | number,
  name: string,
  user?: string,
  password?: string,
): string;
export const env: Env.env;
export function esmRequire(path: string): any;
export function esmResolve(mod: any): any;
export const factory: Factory.factory;
export const fake: Fake.fake;
export const id: typeof uuid;
export const logger: Logger;
export function pathTo(...paths: string[]): string;
export const queue: Queue.queue;
export function requireAll(incomingOptions: requireAllOptions | string): any[];
export const server: Server.server;
export const validator: Validator.validator;
export function validatorMiddleware(
  type: string,
  schema: HapiSchema,
): (req: Request, res: Response, next: NextFunction) => void;

// Types to extend inside application
export interface DomainValidator {
  [key: string]: HapiSchema;
}

export interface DomainController {
  [key: string]: (req: Request, res: Response, next?: NextFunction) => void;
}
