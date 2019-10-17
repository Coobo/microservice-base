/**
 * @param {string} string
 */
function capitalize(string) {
  return `${string[0].toUpperCase()}${string.substr(1)}`;
}

export default ({ ValidatorMiddleware, Container }) => {
  return function validate(type, schemaOrSchemaNameOrSchemaNamePlusMethod) {
    let schema = schemaOrSchemaNameOrSchemaNamePlusMethod;

    if (typeof schema === 'string') {
      const [
        schemaName,
        schemaMethod,
      ] = schemaOrSchemaNameOrSchemaNamePlusMethod.split('.');

      let schemaFullName = capitalize(schemaName);

      if (schemaMethod) schemaFullName += capitalize(schemaMethod);

      if (schemaFullName.indexOf('Validator') === -1)
        schemaFullName += 'Validator';

      if (!Container.has(schemaFullName))
        throw new Error(
          `The provided schema does not exist. Please make sure there is a ${schemaMethod}.js file inside ${schemaName} Domain folder.`,
        );

      schema = Container.resolve(schemaFullName);
    }

    if (!schema.validate || typeof schema.validate !== 'function')
      throw new Error('The provided schema is not valid.');

    return ValidatorMiddleware(type, schema);
  };
};
