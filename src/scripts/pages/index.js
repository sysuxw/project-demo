require(['../config'], function() {
  'use strict';
  require(['jquery', 'navbar', 'bootstrap'], function($, navbar) {
    navbar.init(0);
    $('#modal--add-exchange').modal();
  });
});
