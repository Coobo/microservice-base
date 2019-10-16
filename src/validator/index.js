import Joi from '@hapi/joi';

import cnpj from './extensions/cnpj';
import cpf from './extensions/cpf';

const JoiCnpjExtension = {
  type: 'cnpj',
  base: Joi.string(),
  messages: {
    cnpj: 'cnpj is not valid',
  },
  validate(value, helpers) {
    if (!cnpj.isValid(value)) {
      return { value, errors: helpers.error('cnpj', { v: value }) };
    }

    return { value };
  },
};

const JoiCpfExtension = {
  type: 'cpf',
  base: Joi.string(),
  messages: {
    cnpj: 'cpf is not valid',
  },
  validate(value, helpers) {
    if (!cpf.isValid(value)) {
      return { value, errors: helpers.error('cpf', { v: value }) };
    }

    return { value };
  },
};

const extendedJoi = Joi.extend(JoiCnpjExtension, JoiCpfExtension);

export default extendedJoi;
