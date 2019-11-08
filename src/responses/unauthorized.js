import config from '../config';

config.defaults('response.messages', {
  unauthorized: 'You need to be authenticated to access this route.',
});

async function unauthorizedResponse({
  res,
  reason = null,
  customMessage = null,
}) {
  const responseObject = {
    message: customMessage || config.get('response.messages.unauthorized'),
  };
  if (reason) responseObject.reason = reason;

  return res.status(401).json(responseObject);
}

export default unauthorizedResponse;
