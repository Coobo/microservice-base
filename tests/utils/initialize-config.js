import { join } from 'path';

import config from '../../src/config';
import esmResolve from '../../src/utils/esm-resolve';
import requireAll from '../../src/utils/require-all';

const CONFIG_PATH = join(__dirname, '../unit/', 'config-path/');

config._config = requireAll({
  dirname: CONFIG_PATH,
  resolve: mod => {
    const resolvedModule = esmResolve(mod);
    return typeof resolvedModule === 'function'
      ? resolvedModule(config._env)
      : resolvedModule;
  },
});

export default config;
