Package.describe({
  name:     'japetheape:i18n',
  version:  '0.5.0',
  summary:  'Internalization: simplest package, clone of anti:18n, props to them!',
  git:      'https://github.com/japetheape/meteor-i18n.git',
});

Package.on_use(function (api, where) {
  api.versionsFrom('0.9.0');
  api.use(['underscore', 'ui', 'deps'], ['client', 'server']);
  api.export('Anti', ['client', 'server']);
  api.add_files('i18n.js', ['client', 'server']);
});

// Package.on_test(function(api){
//   api.use(['tinytest','handlebars','test-helpers','templating', 'test-helpers', 'jquery'], ['client', 'server']);
//   api.add_files(['tests/shared/i18n.js']);
//   api.add_files(['tests/client/i18n.js', 'tests/client/i18n.html'], ['client']);

// });
