Package.describe({
  name: 'dharsh:errors',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A code template  to display application errors to the user',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: null
});

Package.onUse(function(api,where) {
  api.versionsFrom('1.0.3.1');
  api.use(['minimongo', 'mongo-livedata', 'templating'], 'client');
  api.addFiles(['errors.js', 'errors_list.html', 'errors_list.js'], 'client');
  if (api.export) 
    api.export('Errors');
});

Package.onTest(function(api) {
  api.use('dharsh:errors', 'client');
  api.use(['tinytest', 'test-helpers'], 'client');
  api.addFiles('errors_tests.js', 'client');
});