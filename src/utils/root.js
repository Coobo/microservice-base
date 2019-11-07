import { join, resolve } from 'path';

const APP_ROOT = process.cwd();

export default APP_ROOT;
export const appRoot = APP_ROOT;
export const pathTo = function pathTo(...paths) {
  return resolve(join(APP_ROOT, ...paths));
};
