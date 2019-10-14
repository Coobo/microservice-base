module.exports = function esmResolver(output) {
  return output && output.__esModule && output.default
    ? output.default
    : output;
};
