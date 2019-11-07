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
);
