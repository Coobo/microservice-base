export default ({ Container }) => {
  return controllerNameOrControllerNamePlusMethod => {
    let controllerName = controllerNameOrControllerNamePlusMethod;
    let controllerMethod;

    /**
     * Check if method name was provided.
     */
    if (controllerNameOrControllerNamePlusMethod.indexOf('.') > -1)
      [
        controllerName,
        controllerMethod,
      ] = controllerNameOrControllerNamePlusMethod.split('.');

    /**
     * Normalize controller name by appending Controller suffix
     */
    if (controllerName.indexOf('Controller') === -1)
      controllerName += 'Controller';

    if (!Container.has(controllerName))
      throw new Error(
        `You tried to load the controller ${controllerName} which does not exist.`,
      );

    const controller = Container.resolve(controllerName);
    if (!controllerMethod) return controller;
    if (!controller[controllerMethod])
      throw new Error(
        `${controllerName}'s method ${controllerMethod} does not exist`,
      );

    return controller[controllerMethod].bind(controller);
  };
};
