/**
 * Created by chu on 04/10/2016.
 */
'use strict';

angular.module('eklabs.angularStarterPack.forms')
    .directive('myProfileLinker',function($log, $http, $q){
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/ttc-linker/directives/my-linker/linkerView.html',
            scope : {
                user        : '=',
                callback    : '=?'
            },link : function(scope){
                var userRoute="http://91.134.241.60:3080/resources/users/";

              //TODO : remplacer par appel ajax
              /*scope.userList = [
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
              ];*/

                /**
                 *
                 */
                scope.$watch('user', function(myUserId) {
                    if (myUserId === undefined) {
                        resetUser();
                    } else {
                        scope.findUser(myUserId).then(
                            // si id de l'utilisateur trouvé
                            function (result) {
                                scope.userObject=result.data;
                                var friendsPromises = scope.userObject.friends.map(function (friendId) {
                                    return scope.findUser(friendId);
                                });
                                $q.all(friendsPromises).then (function (results) {
                                    scope.userFriends = results.map(function (result) {
                                        return result.data;
                                    });
                                    scope.isLogged = true;
                                });
                            },
                            // si id de l'utilisateur non trouvé
                            function (error) {
                                $log.error("Erreur de récupération de l'utilisteur", error);
                                resetUser();
                            });
                    }

                });

                function resetUser() {
                    scope.isLogged = false;
                    scope.userObject = undefined;
                    scope.userFriends = [];
                }

                // Fonction permettant de récupérer un utilisateur via son id
                scope.findUser = function(id) {
                    return $http.get(userRoute+id);
                  /*return scope.userList.find(function(user) {
                    return user.id === id;
                  });*/
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
