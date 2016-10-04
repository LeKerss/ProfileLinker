/**
 * Created by chu on 04/10/2016.
 */
'use strict';

angular.module('eklabs.angularStarterPack.forms')
    .directive('myProfileLinker',function($log){
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/ttc-linker/directives/my-linker/linkerView.html',
            scope : {
                user        : '=',
                callback    : '=?'
            },link : function(scope){

                /**
                 *
                 */
                scope.$watch('user', function(myUser){
                    scope.myUser = myUser;
                });


                /**
                 * Default Actions
                 * @type {{onValid: default_actions.onValid}}
                 */
                var default_actions = {
                    onValid : function(user){
                        $log.info('my user is : ',user)
                    }
                };

                /**
                 * Catch Callback
                 */
                scope.$watch('callback', function(callback){
                    if(callback instanceof Object){
                        scope.actions = angular.extend({},default_actions,callback);
                    }else{
                        scope.actions = default_actions;
                    }
                });

            }
        }
    });