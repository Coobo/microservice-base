import fs from 'fs';
import { join } from 'path';

function identity(val) {
  return val;
}

function requireAll(incomingOptions) {
  const options =
    typeof incomingOptions === 'string'
      ? { dirname: incomingOptions }
      : incomingOptions;

  const {
    dirname,
    excludeDirs = /^\./,
    filter = /^([^\.].*)\.js(on)?$/,
    recursive = true,
    resolve = identity,
    map = identity,
    optional = false,
  } = options;

  function shouldExcludeDir(dirnameToTest) {
    return !recursive || (excludeDirs && dirnameToTest.match(excludeDirs));
  }

  function filterFile(fileName) {
    if (typeof filter === 'function') {
      return filter(fileName);
    }

    const match = fileName.match(filter);
    if (!match) return null;

    return match[1] || match[0];
  }

  const modules = {};

  if (optional && !fs.existsSync(dirname)) return modules;

  const files = fs.readdirSync(dirname);

  files.forEach(file => {
    const filePath = join(dirname, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (shouldExcludeDir(filePath)) return;

      const subModules = requireAll({
        dirname: filePath,
        filter,
        excludeDirs,
        map,
        resolve,
      });

      if (Object.keys(subModules).length === 0) return;

      modules[map(file, filePath)] = subModules;
    } else {
      const name = filterFile(file);
      if (!name) return;

      modules[map(name, filePath)] = resolve(require(filePath));
    }
  });

  return modules;
}

export default requireAll;
