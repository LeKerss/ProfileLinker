angular.module('eklabs.angularStarterPack').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('eklabs.angularStarterPack/modules/forms/directives/my-form/myFormView.html',
    "<form name=\"myForm\" ng-submit=\"actions.onValid(myUser)\">\n" +
    "\n" +
    "    <div layout=\"column\" >\n" +
    "        <md-input-container >\n" +
    "            <label>FirstName</label>\n" +
    "            <input name=\"name\" ng-model=\"myUser.firstname\" />\n" +
    "        </md-input-container>\n" +
    "\n" +
    "        <md-input-container >\n" +
    "            <label>LastName</label>\n" +
    "            <input name=\"name\" ng-model=\"myUser.lastname\" />\n" +
    "        </md-input-container>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <md-button type=\"submit\">\n" +
    "        <md-icon md-svg-src=\"material-design:done\"></md-icon>\n" +
    "        Valider\n" +
    "    </md-button>\n" +
    "\n" +
    "\n" +
    "</form>"
  );


  $templateCache.put('eklabs.angularStarterPack/modules/json-editor/directives/editor/view.html',
    "<form id        =   \"myJsonEditor\"\n" +
    "      name      =   \"myForm\"\n" +
    "      novalidate\n" +
    "      layout    =   \"column\"\n" +
    "      ng-submit =   \"myForm.$valid && !editorError && !eerror.length && actions.valid(currentJson)\"\n" +
    "      ng-style  =   \"{'min-height' : currentHeight, 'max-height' : currentHeight}\"\n" +
    "      style=\"overflow-y: hidden;overflow-x: hidden\">\n" +
    "\n" +
    "    <!-- FORM CONTENT -->\n" +
    "    <div flex\n" +
    "         layout     =   \"column\"\n" +
    "         style      =   \"overflow-y:auto;overflow-x: hidden;\"\n" +
    "         ng-style   =   \"{'min-height' : maxHeightContainer , 'max-height' : maxHeightContainer}\">\n" +
    "\n" +
    "        <div layout=\"column\" flex ng-if=\"aceAvailable\">\n" +
    "\n" +
    "            <h2 class=\"title\">Editeur JSON </h2>\n" +
    "\n" +
    "            <div ui-ace=\"aceOption\" ng-model=\"aceModel\" style=\"width: 100%\" ng-style = \"{'max-height' : aceMaxHeight }\"></div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- BOUTON ACTIONS -->\n" +
    "    <div layout=\"row\" layout-align=\"start center\" class=\"shadow_up\" >\n" +
    "\n" +
    "        <div ng-if=\"errors.length || editorError\" layout=\"row\" class=\"warn-font\" style=\"font-size: 0.9em\">\n" +
    "\n" +
    "            <md-icon md-svg-src=\"material-design:error_outline\" class=\"ic_16px warn-font\"></md-icon>\n" +
    "\n" +
    "            <span ng-if=\"errors.length\" ng-repeat=\"error in errors\">{{error}}</span>\n" +
    "\n" +
    "            <span ng-if=\"editorError\" style=\"margin-left: 10px;\">{{editorError}}</span>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div flex></div>\n" +
    "\n" +
    "        <md-button type=\"submit\" aria-label=\"test\" ng-disabled=\"editorError || errors.length\">\n" +
    "            <md-icon md-svg-src=\"material-design:done\"></md-icon>\n" +
    "            <span style=\"font-weight:200\">Valider</span>\n" +
    "        </md-button>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</form>"
  );

}]);
