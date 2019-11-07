export default function esmResolve(output) {
  return output && output.__esModule && output.default
    ? output.default
    : output;
}
