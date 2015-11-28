define(['jquery'], function($) {
  'use strict';
  return {
    init: function(page) {
      $($('#navigator>li').get(page)).addClass('active'); // 初始化active标签
    }
  };
});
