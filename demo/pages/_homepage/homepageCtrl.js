'use strict';

angular.module('demoApp')
    .controller('homepageCtrl', function($scope,$http,$state){

        $http.get('data/pages.json').then(function(response){
            $scope.pages = response.data;
        });

        $scope.goTo = function(state){
            if(state){
                $state.transitionTo(state);
            }
        }

    });