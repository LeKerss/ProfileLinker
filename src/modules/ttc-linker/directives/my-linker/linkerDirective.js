/**
 * Created by chu on 04/10/2016.
 */
'use strict';

angular.module('eklabs.angularStarterPack.forms')
    .directive('myProfileLinker',function($log, $http){
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/ttc-linker/directives/my-linker/linkerView.html',
            scope : {
                user        : '=',
                callback    : '=?'
            },link : function(scope){

              //TODO : remplacer par appel ajax
              scope.userList = [
                {
                    id      :  1,
                    name    : "Annas Saker",
                    photo   : "http://2.bp.blogspot.com/-bQKvDrSnBHA/VKHJT_vNXiI/AAAAAAAASfk/MIP0_2Ln1Ns/s1600/Photos-petit-chat-blanc-0.jpg",
                    friends : [
                      2,
                      3
                    ],
                    status  : 1
                },
                {
                    id      : 2,
                    name    : "Cecile Hu",
                    photo   : "https://cdn.pixabay.com/photo/2016/03/04/22/54/panda-1236875_960_720.jpg",
                    friends : [
                      1
                    ],
                    status  : 0
                },
                {
                    id      : 3,
                    name    : "Ludo Babadjo",
                    photo   : "http://www.jdubuzz.com/files/2015/07/bonjour-peuple-mexicain_54k7r_25yo9p.jpg",
                    friends : [
                      1
                    ],
                    status  : 1
                }
              ];

                /**
                 *
                 */
                scope.$watch('user', function(myUserId) {
                    if (myUserId === undefined) {
                        scope.isLogged = false;
                        scope.userObject = undefined;
                        scope.userFriends = [];
                    } else {
                        scope.userObject = scope.findUser(myUserId);
                        scope.userFriends = scope.getFriends(myUserId);
                        scope.isLogged = true;
                    }

                });

                // Fonction permettant de récupérer un utilisateur via son id
                scope.findUser = function(id) {
                  return scope.userList.find(function(user) {
                    return user.id === id;
                  });
                };

                scope.getFriends = function(userId) {

                  //TODO ajax
                  // $http.get()
                  return scope.findUser(userId).friends.map(function(id) {
                      return scope.findUser(id);
                    }
                  )

                }




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

                scope.maListe = [
                    {
                        name : "Cécile Hu",
                        photo:"",
                        status : "1"
                    },
                    {
                        name : "Annas Saker",
                        photo:"",
                        status : "1"
                    },
                    {
                        name : "Ludo Babadjo",
                        photo:"",
                        status : "0"
                    },

                ];

            }
        }
    });
