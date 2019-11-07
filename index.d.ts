import { Application, RequestHandler, Router } from 'express';
import { Connection, ConnectionOptions, Model, Mongoose } from 'mongoose';
import { Logger } from 'pino';
import Bull from 'bull';
import { Root } from '@hapi/joi';

export as namespace Base;

export function requireAll(paths: string[]): any;
export function esmRequire(path: string): any;
export function esmResolve(mod: any): any;
export function capitalizeString(str: string): string;
export const appRoot: string;
export function pathTo(...paths: string[]): string;
export function dbUri(
  host: string,
  port: string | number,
  name: string,
  user?: string,
  password?: string,
): string;

export namespace env {
  /** The path to .env file */
  export const _envPath: string;
  /** The path to .env.test file */
  export const _testEnvPath: string;

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
  export function get(
    key: string,
    defaultValue?: string | boolean | null | undefined,
  ): any;

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
  export function getOrFail(
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
  export function set(key: string, value: any): void;

  /**
   * Process a string with .env definitions.
   */
  export function process(envContents: string, overwrite?: boolean): void;

  /**
   * Casts the string value to their native data type.
   */
  export function _castValue(
    value: string,
  ): string | boolean | null | undefined;

  /**
   * Initializes Env and processes env files
   */
  export function init(): ThisType;
}

export namespace config {
  /**
   * An array with all configuration objects available.
   */
  export var _config: object[];

  /**
   * Gets a configuration or returns a defaultValue if the requests config is
   * not available.
   */
  export function get(key: string, defaultValue?: any): any;

  /**
   * Merges a configuration key with default values using a customizer.
   */
  export function merge(
    key: string,
    defaultValues?: object,
    customizer: function,
  ): any;

  /**
   * Sets a configuration.
   */
  export function set(key: string, value: any): void;

  /**
   * Sets a configuration merging it with previously set values.
   */
  export function defaults(key: string, value: any): void;
}

export namespace server {
  export const _express: Application;
  export function _compression(): void;
  export function _security(): void;
  export function _proxy(): void;
  export function _statusRoute(): void;
  export function _cors(): void;
  export function _parsers(): void;
  export function _exceptionHandler(): void;
  export function _board(): void;
  export function use(...middlewares: RequestHandler[]): void;
  export function init(): void;
  export function boot(): void;
  export function openRouter(): Router;
  export function useRouter(...params: Router[] | string[]): void;
}

export namespace db {
  export const _connection: Connection;
  export const _uri: string;
  export const _options: ConnectionOptions;
  export const models: Model[];
  export const mongoose: Mongoose;

  export function connect(): void;
  export function get(name: string): Model;
  export function add(model: Model, name?: string): void;
  export function has(name: string): boolean;
  export function load(modelPath: string, name?: string): void;
}

export const logger: Logger;

export namespace queue {
  export interface Queue {
    key: string;
    handle(data: Bull.Job): null;
    name?: string;
    bull?: Bull.Queue;
    options?: Bull.JobOptions;
  }

  export const _queues: Map<string, Queue>;
  export const _redisConfig: object;
  export const queuesArray: Bull.Queue[];

  export function add(
    key: string,
    data: object,
    options: Bull.JobOptions,
  ): Bull.JobPromise;
  export function queue(queue: Queue): ThisType;
  export function init(): void;
  export function process(): void;
}

export const validator: Root;

export namespace app {
  export const root: string;
  export const folder: string;
  export const env: string;
  export const inTest: boolean;
  export const inProd: boolean;
  export const inStage: boolean;
  export const inDev: boolean;
  export const name: string;
  export const package: object;
  export const version: string;
  export const coreVersion: string | undefined;

  export function path(...paths: string[]): string;
  export function load(): void;
}
