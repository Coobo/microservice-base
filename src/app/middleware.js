export default ({ Container }) => {
  return middlewareName => {
    if (middlewareName.indexOf('Middleware') === -1)
      middlewareName += 'Middleware';
    if (Container.has(middlewareName)) return Container.resolve(middlewareName);

    throw new Error(
      `You tried to load the middleware ${middlewareName} which does not exist.`,
    );
  };
};
