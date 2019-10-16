export default ({ ValidatorMiddleware, Container }) => {
  return function validate(type, schemaOrSchemaName) {
    const schema =
      typeof schemaOrSchemaName === 'string'
        ? Container.resolve(schemaOrSchemaName)
        : schemaOrSchemaName;

    if (!schema.validate || typeof schema.validate !== 'function')
      throw new Error('The provided schema is not valid.');

    return ValidatorMiddleware(type, schema);
  };
};
