import { Application, RequestHandler, Router } from 'express';

// export function requireAll(paths: string[]): any;
// export function esmRequire(path: string): any;
// export function esmResolve(mod: any): any;
// export function capitalizeString(str: string): string;
// export const appRoot: string;
// export function pathTo(...paths: string[]): string;
// export function dbUri(
//   host: string,
//   port: string | number,
//   name: string,
//   user?: string,
//   password?: string,
// );
declare namespace Base {
  interface server {
    private _express: typeof Application;
    private _compression(): void;
    private _security(): void;
    private _proxy(): void;
    private _statusRoute(): void;
    private _cors(): void;
    private _parsers(): void;
    private _exceptionHandler(): void;
    private _board(): void;
    use(...middlewares: typeof RequestHandler[]): void;
    init(): void;
    boot(): void;
    openRouter(): typeof Router;
    useRouter(...params: typeof Router[] | string[]): void;
  }

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

    path(...paths: string[]): string;
    load(): void;
  }
}

export = Base;
