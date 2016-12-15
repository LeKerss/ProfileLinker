/**
 * Created by chu on 04/10/2016.
 */
'use strict';

angular.module('eklabs.angularStarterPack.forms')
    .directive('myProfileLinker',function($log, $http, $mdDialog, $q){
        return {
          templateUrl : 'eklabs.angularStarterPack/modules/ttc-linker/directives/my-linker/linkerView.html',
            scope : {
                user        : '=',
                callback    : '=?'
            },link : function(scope){
                var userRoute="http://91.134.241.60:3080/resources/users/";
                scope.loading=false;

                /**
                 *
                 */
                scope.$watch('user', function(myUserId) {
                    if (myUserId === undefined) {
                        resetUser();
                    } else {

                        getUser(myUserId);

                    }

                });

                function getUser(myUserId) {
                    var deferred = $q.defer(); // objet en attente

                    $q.when(deferred.promise, function () {
                        scope.loading = false;
                    });

                    return findUser(myUserId).then(
                        // si id de l'utilisateur trouvé
                        function (result) {
                            scope.userObject=result.data;
                            // dans tous les cas
                            getFriends().finally(function () {
                                deferred.resolve();
                            });
                        },
                        // si id de l'utilisateur non trouvé
                        function (error) {
                            $log.error("Erreur de récupération de l'utilisteur", error);
                            resetUser();
                            deferred.resolve();
                        });
                }

                function resetUser() {
                    scope.isLogged = false;
                    scope.userObject = undefined;
                    scope.userFriends = [];
                }

                // Fonction permettant de récupérer un utilisateur via son id
                function findUser(id) {
                    return $http.get(userRoute+id, {timeout: 5000});
                  /*return scope.userList.find(function(user) {
                    return user.id === id;
                  });*/
                }

                function getFriends() {
                    var friendsPromises = scope.userObject.friends.map(function (friendId) {
                        return findUser(friendId);
                    });
                    return $q.all(friendsPromises).then (function (results) {
                        scope.userFriends = results.map(function (result) {
                            return result.data;
                        });
                        scope.isLogged = true;
                    });

                }


                /**
                 * Default Actions
                 * @type {{onValid: default_actions.onValid}}
                 */
                var default_actions = {
                    onValid : function(myUserId){
                        $log.info('my user is : ',myUserId)
                        getUser(myUserId);
                        scope.loading=true;
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

                scope.toggleAddFriends = function(ev) {
                    $mdDialog.show({
                      controller : AddFriendsDialogController,
                      templateUrl: "eklabs.angularStarterPack/modules/ttc-linker/directives/my-linker/addFriendsDialogView.html",
                      parent      : angular.element(document.body),
                      targetEvent : ev,
                      clickOutsideToClose:true,
                      fullscreen : scope.customFullscreen,
                      locals: {
                        myUser: scope.userObject
                      }
                    })
                    .then(function(newFriend){

                    }, function(){

                    });
                }

                function AddFriendsDialogController(scope, $mdDialog, myUser){

                  scope.myUser = myUser;


                  scope.addFriend = function (person) {
                    if(!person.requests){
                      person.requests = [];
                    }
                    if(person.requests.indexOf(myUser.id) ==! -1){
                      return
                    }
                    var updatedPerson = person;
                    updatedPerson.requests.push(myUser.id);

                    $http({
                      method: "PUT",
                      url:  userRoute + person.id,
                      data: updatedPerson
                    }).then(
                      function successCallback(response) {
                        person = updatedPerson;
                        console.log("updated :", response)
                      },
                      function errorCallback(response) {
                        console.log(response);
                      });

                  };

                  scope.people = [];

                  $http({
                    method: "GET",
                    url: userRoute,
                  }).then(function successCallback(response){
                    // console.log(response)
                    scope.people = response.data;
                    scope.people = scope.people.filter(function(p){
                      return ((typeof p == "object") && (p.id !== scope.myUser.id) && (scope.myUser.friends.indexOf(p.id) === -1));
                    });

                  }, function errorCallback(response){
                    console.log(response);
                  });

                  scope.hide = function() {
                    $mdDialog.hide();
                  };

                  scope.cancel = function() {
                    $mdDialog.cancel();
                  };

                  scope.friendAdded = function(newFriend) {
                    $mdDialog.hide(newFriend);
                  };
              };

              scope.havingRequests = function() {
                return (scope.userObject.requests.length > 0);
              }

              scope.toggleMyRequests = function(ev) {
                  $mdDialog.show({
                    controller : myRequestsDialogController,
                    templateUrl: "eklabs.angularStarterPack/modules/ttc-linker/directives/my-linker/myRequestsDialogView.html",
                    parent      : angular.element(document.body),
                    targetEvent : ev,
                    clickOutsideToClose:true,
                    fullscreen : scope.customFullscreen,
                    locals: {
                      myUser: scope.userObject
                    }
                  })
                  .then(function(newFriend){

                  }, function(){

                  });
              }

              function myRequestsDialogController(scope, $mdDialog, myUser){

                scope.myUser = myUser;


                scope.addFriend = function (person) {
                  if(!person.requests){
                    person.requests = [];
                  }
                  if(person.requests.indexOf(myUser.id) ==! -1){
                    return
                  }
                  var updatedPerson = person;
                  updatedPerson.requests.push(myUser.id);

                  $http({
                    method: "PUT",
                    url:  userRoute + person.id,
                    data: updatedPerson
                  }).then(
                    function successCallback(response) {
                      person = updatedPerson;
                      console.log("updated :", response)
                    },
                    function errorCallback(response) {
                      console.log(response);
                    });

                };

                scope.people = [];

                $http({
                  method: "GET",
                  url: userRoute,
                }).then(function successCallback(response){
                  // console.log(response)
                  scope.people = response.data;
                  scope.people = scope.people.filter(function(p){
                    return ((typeof p == "object") && (p.id !== scope.myUser.id) && (scope.myUser.friends.indexOf(p.id) === -1));
                  });

                }, function errorCallback(response){
                  console.log(response);
                });

                scope.hide = function() {
                  $mdDialog.hide();
                };

                scope.cancel = function() {
                  $mdDialog.cancel();
                };

                scope.friendAdded = function(newFriend) {
                  $mdDialog.hide(newFriend);
                };
            };

            }
        }
    });
