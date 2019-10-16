const fs = require('fs');
const path = require('path');

class Application {
  constructor({ appRoot, Container, esmRequire, asClass, asFunction }) {
    this._container = Container;
    this._require = esmRequire;
    this._asClass = asClass;
    this._asFunction = asFunction;
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
    return path.join(this.appRoot, 'src/config');
  }

  servicesPath() {
    return path.join(this.appRoot, 'src/services');
  }

  domainsPath() {
    return path.join(this.appRoot, 'src/domains');
  }

  controllersTest() {
    return /(.*)Controller\.js/i;
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

  loadControllers() {
    const domainsPath = this.domainsPath();
    const domains = fs.readdirSync(domainsPath);
    for (const domain of domains) {
      const domainPath = path.join(domainsPath, domain);
      const files = fs.readdirSync(domainPath);
      for (const file of files) {
        const filePath = path.join(domainPath, file);
        if (this.seedersTest().test(file)) this.registerSeeder(filePath);
        if (this.validatorsTest().test(file))
          this.registerValidator(file, filePath);
        if (this.modelsTest().test(file)) this.registerModel(filePath);
        if (this.controllersTest().test(file))
          this.registerController(filePath);
      }
    }
  }

  registerController(filePath) {
    const module = this._require(filePath);
    const name = `${this._getDomainName(filePath)}Controller`;
    this._container.register({ [name]: this._asClass(module).singleton() });
  }

  registerModel(filePath) {
    const module = this._require(filePath);
    const name = `${this._getDomainName(filePath)}Model`;
    this._container.register({ [name]: this._asFunction(module).singleton() });
  }

  _capitalizeString(string) {
    return `${string[0].toUpperCase()}${string.substr(1).toLowerCase()}`;
  }

  _getDomainName(filePath) {
    const parts =
      filePath.indexOf('/') > -1 ? filePath.split('/') : filePath.split('\\');
    parts.pop();
    return this._capitalizeString(parts.pop());
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
        [name]: this._asFunction(requiredModule).singleton(),
      });
    });
  }

  registerSeeder(filePath) {
    const module = this._require(filePath);
    const name = `${this._getDomainName(filePath)}Seeder`;
    this._container.register({ [name]: this._asFunction(module).singleton() });
  }
}

module.exports = Application;
