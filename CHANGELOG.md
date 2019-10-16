# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.6.4](https://github.com/Coobo/microservice-base/compare/v1.6.3...v1.6.4) (2019-10-16)


### Bug Fixes

* app properly loads files in production build ([07a4ace](https://github.com/Coobo/microservice-base/commit/07a4aceb3f47bc15d14c033fe71269f7b0ac101b))

### [1.6.3](https://github.com/Coobo/microservice-base/compare/v1.6.2...v1.6.3) (2019-10-16)


### Bug Fixes

* removing .js from validator name ([37578a9](https://github.com/Coobo/microservice-base/commit/37578a9bf1f023e532de6dd712569540765c1d07))

### [1.6.2](https://github.com/Coobo/microservice-base/compare/v1.6.1...v1.6.2) (2019-10-16)


### Bug Fixes

* validators are properly loaded ([a742dce](https://github.com/Coobo/microservice-base/commit/a742dce6b6895513c18d0a7482afae4992b503f9))

### [1.6.1](https://github.com/Coobo/microservice-base/compare/v1.6.0...v1.6.1) (2019-10-16)


### Bug Fixes

* validate now is autoregistered into the container ([bb43b71](https://github.com/Coobo/microservice-base/commit/bb43b712108ecc91e2a453b6dafaa20015748502))

## [1.6.0](https://github.com/Coobo/microservice-base/compare/v1.5.4...v1.6.0) (2019-10-16)


### Features

* validate function and validator middleware ([198e5cd](https://github.com/Coobo/microservice-base/commit/198e5cdfc41d516dfd8e781c5c6f47cf65583476))
* validator using joi ([6a9cdf0](https://github.com/Coobo/microservice-base/commit/6a9cdf044c4d00b0d1e53b62a02952c23888640d))


### Bug Fixes

* putting validator contents inside proper file ([30934e1](https://github.com/Coobo/microservice-base/commit/30934e16d19c8745bd13b49507c772b90daa47ac))

### [1.5.4](https://github.com/Coobo/microservice-base/compare/v1.5.3...v1.5.4) (2019-10-15)


### Bug Fixes

* controller and middleware helpers now gets registered in index ([77c700e](https://github.com/Coobo/microservice-base/commit/77c700ee5c382ee36fe5e378ad30a5a927172b2f))

### [1.5.3](https://github.com/Coobo/microservice-base/compare/v1.5.2...v1.5.3) (2019-10-15)


### Bug Fixes

* controller and middleware cant be imported by require ([c157d84](https://github.com/Coobo/microservice-base/commit/c157d84aa27a23a02beb8dae6317064802667e1d))

### [1.5.2](https://github.com/Coobo/microservice-base/compare/v1.5.1...v1.5.2) (2019-10-15)


### Bug Fixes

* import placement ([03e3315](https://github.com/Coobo/microservice-base/commit/03e3315e10ca55707faab72f4a0d718979744ea4))

### [1.5.1](https://github.com/Coobo/microservice-base/compare/v1.5.0...v1.5.1) (2019-10-15)


### Bug Fixes

* middleware and controller were not in container ([afcd542](https://github.com/Coobo/microservice-base/commit/afcd54270f49c0dce365ef2e0591724d8be79bbb))

## [1.5.0](https://github.com/Coobo/microservice-base/compare/v1.4.0...v1.5.0) (2019-10-15)


### Features

* controller helper function ([4b981b4](https://github.com/Coobo/microservice-base/commit/4b981b4d9b7ec41d8debe7201048630c04dbdc6a))
* middleware loader helper ([e0d0b6d](https://github.com/Coobo/microservice-base/commit/e0d0b6dd486d58f857ac16af49048ae08bac021e))

## [1.4.0](https://github.com/Coobo/microservice-base/compare/v1.3.0...v1.4.0) (2019-10-14)


### Features

* container injector automatically inputed to express ([a054f3b](https://github.com/Coobo/microservice-base/commit/a054f3b37ee7e4fa22f9cd3bd7d221d1b72e7bf4))
* server router registering ([f015086](https://github.com/Coobo/microservice-base/commit/f01508655ed6a62bcc942b7faf5e75e513c5af76))

## [1.3.0](https://github.com/Coobo/microservice-base/compare/v1.2.0...v1.3.0) (2019-10-14)


### Features

* container scoped and injected inside req ([9d8652e](https://github.com/Coobo/microservice-base/commit/9d8652e551dc9b198e66eb12830062dafd60293a))
* exception handler middleware now leverages req.log to log error ([33f939a](https://github.com/Coobo/microservice-base/commit/33f939ae3fd3c6e3da67bbf495244e0bb7c7f655))


### Bug Fixes

* needed env files do run tests ([9b9023f](https://github.com/Coobo/microservice-base/commit/9b9023f542721ac403e92533087b586c95c1afb0))

## [1.2.0](https://github.com/Coobo/microservice-base/compare/v1.1.0...v1.2.0) (2019-10-14)


### Bug Fixes

* log default levels ([8a03eb7](https://github.com/Coobo/microservice-base/commit/8a03eb70e7435a94268095a0c0ca21a24e4fdbca))

## [1.1.0](https://github.com/Coobo/microservice-base/compare/v1.0.0...v1.1.0) (2019-10-14)


### Features

* pino-pretty installed on the right place ([eab4511](https://github.com/Coobo/microservice-base/commit/eab4511b2db3aebf7d04d965ae176ff4b7e59819))

## [1.0.0](https://github.com/Coobo/microservice-base/compare/v0.0.4...v1.0.0) (2019-10-14)

### [0.0.4](https://github.com/Coobo/microservice-base/compare/v0.0.3...v0.0.4) (2019-10-14)


### Bug Fixes

* prerelease location fixed ([2cd58ae](https://github.com/Coobo/microservice-base/commit/2cd58ae38c70b2c90cb794a49eaef44f0dd18dc0))

### [0.0.3](///compare/v0.0.2...v0.0.3) (2019-10-14)


### Features

* express-async-errors e700641

### [0.0.2](///compare/v0.0.1...v0.0.2) (2019-10-14)


### Features

* application and bundler 8e0775f
* logger 59d01f7
* server 1033768

### 0.0.1 (2019-10-14)


### Features

* configuration 349422e
* database 2aed5df
* database factory 24c6576
* di container 421a460
* env 1716766


### Bug Fixes

* setting node_env to testing on everty test start 9d3e5be
