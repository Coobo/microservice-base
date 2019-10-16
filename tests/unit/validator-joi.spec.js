import fake from '../../src/fake';
import Joi from '../../src/validator';

describe('Extended Joi (from @hapi/joi)', () => {
  describe('cpf extension', () => {
    it('joi should expose cpf validation method', () => {
      expect(typeof Joi.cpf).toBe('function');
    });

    it('should validate a valid cpf without punctuation', () => {
      const schema = Joi.cpf();
      const value = fake.cpf(false);

      expect(schema.validate(value)).toStrictEqual({ value });
    });

    it('should validate a valid cpf with punctuation', () => {
      const schema = Joi.cpf();
      const value = fake.cpf(true);

      expect(schema.validate(value)).toStrictEqual({ value });
    });

    it('should fail with an valid cpf without punctuation', () => {
      const schema = Joi.cpf();
      const value = '11111111111';

      expect(typeof schema.validate(value).error).toBe('object');
      expect(schema.validate(value).error instanceof Error).toBe(true);
    });

    it('should fail with an valid cpf with punctuation', () => {
      const schema = Joi.cpf();
      const value = '111.111.111-11';

      expect(typeof schema.validate(value).error).toBe('object');
      expect(schema.validate(value).error instanceof Error).toBe(true);
    });
  });

  describe('cnpj extension', () => {
    it('joi should expose cnpj validation method', () => {
      expect(typeof Joi.cnpj).toBe('function');
    });

    it('should validate a valid cnpj without punctuation', () => {
      const schema = Joi.cnpj();
      const value = fake.cnpj(false);

      expect(schema.validate(value)).toStrictEqual({ value });
    });

    it('should validate a valid cnpj with punctuation', () => {
      const schema = Joi.cnpj();
      const value = fake.cnpj(true);

      expect(schema.validate(value)).toStrictEqual({ value });
    });

    it('should fail with an valid cnpj without punctuation', () => {
      const schema = Joi.cnpj();
      const value = '11111111111111';

      expect(typeof schema.validate(value).error).toBe('object');
      expect(schema.validate(value).error instanceof Error).toBe(true);
    });

    it('should fail with an valid cnpj with punctuation', () => {
      const schema = Joi.cnpj();
      const value = '11.111.111/1111-11';

      expect(typeof schema.validate(value).error).toBe('object');
      expect(schema.validate(value).error instanceof Error).toBe(true);
    });
  });
});
