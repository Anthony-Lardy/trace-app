# Ng-Matero

[![npm](https://img.shields.io/npm/v/trace-app.svg)](https://www.npmjs.com/package/trace-app)
[![GitHub Release Date](https://img.shields.io/github/release-date/trace-app/trace-app)](https://github.com/trace-app/trace-app/releases)
[![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/trace-app/trace-app/blob/master/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/trace-app/trace-app.svg)](https://gitter.im/matero-io/trace-app)
[![docs](https://img.shields.io/badge/docs-gitbook-red)](https://nzbin.gitbook.io/trace-app/)
[![Material Extensions](https://img.shields.io/badge/material-extensions-blue)](https://github.com/trace-app/extensions#readme)
[![Financial Contributors on Open Collective](https://opencollective.com/trace-app/all/badge.svg?label=financial+contributors)](https://opencollective.com/trace-app)

Ng-Matero is an Angular admin templete made with Material components.

## Installation

You can use the Anglar CLI Schematics to install the project.

```bash
$ ng new <project-name>
$ cd <project-name>
$ ng add trace-app
```

## Schematics

You can use the trace-app schematics to generate a module or a page.

### Module schematic

Generate a lazy loaded module.

```bash
$ ng g trace-app:module <module-name>
```

The new module will be created in `routes` file, it will be added in `routes.module` and its route declaration will be added in `routes-routing.module` automaticly.

### Page schematic

Generate a page component in the module.

```bash
$ ng g trace-app:page <page-name> -m=<module-name>
```

Generate a entry component in the page component.

```bash
$ ng g trace-app:page <page-name>/<entry-component-name> -m=<module-name> -e=true
```

### Example

Just two steps after initializing the project, you can get a route page.

```bash
$ ng g trace-app:module abc
$ ng g trace-app:page def -m=abc
```

Take a look at `http://localhost:4200/#/abc/def`, enjoy it!

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/trace-app/trace-app/graphs/contributors"><img src="https://opencollective.com/trace-app/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/trace-app/contribute)]

#### Individuals

<a href="https://opencollective.com/trace-app"><img src="https://opencollective.com/trace-app/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/trace-app/contribute)]

<a href="https://opencollective.com/trace-app/organization/0/website"><img src="https://opencollective.com/trace-app/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/trace-app/organization/1/website"><img src="https://opencollective.com/trace-app/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/trace-app/organization/2/website"><img src="https://opencollective.com/trace-app/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/trace-app/organization/3/website"><img src="https://opencollective.com/trace-app/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/trace-app/organization/4/website"><img src="https://opencollective.com/trace-app/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/trace-app/organization/5/website"><img src="https://opencollective.com/trace-app/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/trace-app/organization/6/website"><img src="https://opencollective.com/trace-app/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/trace-app/organization/7/website"><img src="https://opencollective.com/trace-app/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/trace-app/organization/8/website"><img src="https://opencollective.com/trace-app/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/trace-app/organization/9/website"><img src="https://opencollective.com/trace-app/organization/9/avatar.svg"></a>

## License

MIT
