import esmResolve from './esm-resolve';

export default function esmRequire(filePath) {
  return esmResolve(require(filePath));
}
