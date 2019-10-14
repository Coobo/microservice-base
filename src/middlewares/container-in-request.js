import container from '../di';

export default (req, res, next) => {
  req.container = container.createScope();
  return next();
};
