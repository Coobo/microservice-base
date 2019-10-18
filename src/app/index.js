import { asClass, asFunction } from 'awilix';
import fs from 'fs';
import path from 'path';

class Application {
  constructor({ appRoot, esmRequire }) {
    this._require = esmRequire;
    this.inTest = process.env.NODE_ENV === 'testing';
    this.inProduction = process.env.NODE_ENV === 'production';
    this.inDev = !this.inProduction;

    this.appRoot = appRoot;
    this.appName = process.env.APP_NAME || 'spendfy-service';
    this.package = require(path.join(appRoot, 'package.json'));
    this.version = this.package.version || '0.0.0';
    this.coreVersion = this.package.dependencies['@coobo/base'];
  }

  makePath(...paths) {
    return path.join(this.appRoot, ...paths);
  }

  configPath() {
    return this.inDev || this.inTest
      ? path.join(this.appRoot, 'src/config')
      : path.join(this.appRoot, 'dist/config');
  }

  servicesPath() {
    return this.inDev || this.inTest
      ? path.join(this.appRoot, 'src/services')
      : path.join(this.appRoot, 'dist/services');
  }

  domainsPath() {
    return this.inDev || this.inTest
      ? path.join(this.appRoot, 'src/domains')
      : path.join(this.appRoot, 'dist/domains');
  }

  controllerTest() {
    return /(.*)Controller\.js/i;
  }

  controllersTest() {
    return /(.*)controllers/i;
  }

  modelsTest() {
    return /(.*)Model\.js/i;
  }

  validatorsTest() {
    return /(.*)validators/i;
  }

  seedersTest() {
    return /(.*)Seeder\.js/i;
  }

  _capitalizeString(string) {
    return `${string[0].toUpperCase()}${string.substr(1)}`;
  }

  _getDomainName(filePath) {
    const parts =
      filePath.indexOf('/') > -1 ? filePath.split('/') : filePath.split('\\');
    parts.pop();
    return this._capitalizeString(parts.pop());
  }

  registerDomains(container) {
    this._container = container;
    const domainsPath = this.domainsPath();
    const domains = fs.readdirSync(domainsPath);
    for (const domain of domains) {
      const domainPath = path.join(domainsPath, domain);
      const files = fs.readdirSync(domainPath);
      for (const file of files) {
        const filePath = path.join(domainPath, file);
        if (this.seedersTest().test(file)) {
          this.registerSeeder(filePath);
        }
        if (this.validatorsTest().test(file)) {
          this.registerValidator(file, filePath);
        }
        if (this.modelsTest().test(file)) {
          this.registerModel(filePath);
        }
        if (this.controllerTest().test(file)) {
          this.registerController(filePath);
        }
        if (this.controllersTest().test(file)) {
          this.registerControllers(filePath);
        }
      }
    }
  }

  registerController(filePath) {
    const module = this._require(filePath);
    const name = `${this._getDomainName(filePath)}Controller`;
    this._container.register({ [name]: asClass(module).singleton() });
  }

  registerControllers(filePath) {
    const lowerCaseDomainName = this._getDomainName(filePath).toLowerCase();

    for (const moduleFile of fs.readdirSync(filePath)) {
      const moduleFileName = moduleFile.split('.')[0];
      const newFilePath = path.join(filePath, moduleFile);
      const isModuleNameTheSameAsDomainName =
        moduleFileName === lowerCaseDomainName;

      const module = this._require(newFilePath);
      const name = `${this._getDomainName(filePath)}${
        isModuleNameTheSameAsDomainName
          ? ''
          : this._capitalizeString(moduleFileName)
      }Controller`;
      this._container.register({ [name]: asClass(module).singleton() });
    }
  }

  registerModel(filePath) {
    const module = this._require(filePath);
    const name = `${this._getDomainName(filePath)}Model`;
    this._container.register({ [name]: asFunction(module).singleton() });
  }

  registerValidator(file, filePath) {
    const modules = fs.readdirSync(filePath);
    const domainName = this._getDomainName(filePath);

    modules.forEach(moduleName => {
      const modulePath = path.join(filePath, moduleName);
      const requiredModule = this._require(modulePath);
      const name = `${domainName}${this._capitalizeString(
        moduleName.split('.').shift(),
      )}Validator`;

      this._container.register({
        [name]: asFunction(requiredModule).singleton(),
      });
    });
  }

  registerSeeder(filePath) {
    const module = this._require(filePath);
    const name = `${this._getDomainName(filePath)}Seeder`;
    this._container.register({ [name]: asFunction(module).singleton() });
  }
}

module.exports = Application;
