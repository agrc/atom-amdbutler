define(['currentSession'], function(currentSession) {
  'use strict';

  return function() {
    this.login = currentSession.login;
  };
});
