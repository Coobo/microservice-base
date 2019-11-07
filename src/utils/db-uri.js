/**
 * Builds a MongoDB Connection URI
 * @param {string} host
 * @param {string|number} port
 * @param {string} name
 * @param {string} user
 * @param {string} password
 * @returns {string}
 */
export default function buildDBUri(
  host = '127.0.0.1',
  port = '27000',
  name = 'mongo',
  user = null,
  password = null,
) {
  if (user === '') user = null;
  if (user && !password)
    throw new Error('buildDbUri: Provided a user without a password.');

  const requiresAutentication = !!user;

  return `mongodb://${
    requiresAutentication ? `${user}:${password}@` : ''
  }${host}:${port}/${name}${requiresAutentication ? '?authSource=admin' : ''}`;
}
