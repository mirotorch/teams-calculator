(function () {
  "use strict";

  // Call the initialize API first
  microsoftTeams.app.initialize().then(function () {
    microsoftTeams.app.getContext().then(function (context) {
      if (context?.app?.host?.name) {
      }
    });
  });

})();



