'use strict';

angular.module('demoApp')
    .config(function($mdThemingProvider, $mdIconProvider) {

        /**
         * Here your theme
         */
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('blue-grey');

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('blue')
            .dark();
        
        /**
         * Here build your icon libraries
         */
        $mdIconProvider
            .iconSet('material-design','/images/material-design.svg',24);
    });