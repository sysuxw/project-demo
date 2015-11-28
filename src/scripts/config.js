require.config({
  baseUrl: '../static',
  paths: {
    jquery: 'vendors/jquery.min',
    bootstrap: 'vendors/bootstrap.min',
    navbar: 'components/navbar'
  },
  shim: {
    bootstrap: ['jquery']
  }
});
