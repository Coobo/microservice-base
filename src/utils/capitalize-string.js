/**
 * Capitalizes a given string.
 *
 * @param {string} str
 * @param {boolean} [lowercaseRest=false]
 *
 * @returns {string}
 */
export default function capitalizeString(str, lowercaseRest = false) {
  const firstLetter = str[0].toUpperCase();
  let restOfString = str.substr(1);
  if (lowercaseRest === true) restOfString = restOfString.toLowerCase();
  return `${firstLetter}${restOfString}`;
}
