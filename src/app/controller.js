export default ({ Container }) => {
  return controllerName => {
    if (controllerName.indexOf('Controller') === -1)
      controllerName += 'Controller';
    if (Container.has(controllerName)) return Container.resolve(controllerName);

    throw new Error(
      `You tried to load the controller ${controllerName} which does not exist.`,
    );
  };
};
