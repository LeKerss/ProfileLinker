/**
 * Created by chu on 04/10/2016.
 */
'use strict';

angular.module('eklabs.angularStarterPack.ttc-linker')
    .directive('myProfileLinker', function($config, $log, $http, $mdDialog, $q, User, Users) {
        return {
            templateUrl: 'eklabs.angularStarterPack/modules/ttc-linker/directives/my-linker/linkerView.html',
            scope: {
                user: '=',
                callback: '=?',
            },
            link: function(scope) {

                var userRoute = $config.get('api') + "/users";
                scope.loading = false;

                /**
                 *
                 */
                scope.$watch('user', function(myUserId) {
                    if (myUserId === undefined) {
                        resetUser();
                    } else {
                        setCurrentUser(myUserId);
                    }

                });


                function setCurrentUser(myUserId) {
                    User.prototype.get(myUserId)
                        .then(
                            function(result) {
                                scope.userObject = result;
                                updateFriends();
                            },
                            function(error) {
                                console.log(error);
                            }
                        );
                    scope.loading = false;
                    scope.isLogged = true;
                }

                function resetUser() {
                    scope.isLogged = false;
                    scope.userObject = undefined;
                    scope.userFriends = [];
                }

                function getFriends() {
                    var defer = $q.defer();
                    defer.resolve(scope.userObject.getFriends());
                    return defer.promise;
                }

                function updateFriends() {
                    getFriends()
                        .then(function(result) {
                                scope.userFriends = result;
                                // console.log(scope.userFriends);
                            },
                            function(error) {
                                scope.userFriends = [];
                            });
                }


                /**
                 * Default Actions
                 * @type {{onValid: default_actions.onValid}}
                 */
                var default_actions = {
                    onValid: function(myUserId) {
                        $log.info('my user is : ', myUserId)
                        getUser(myUserId);
                        scope.loading = true;
                    }

                };

                /**
                 * Catch Callback
                 */
                scope.$watch('callback', function(callback) {
                    if (callback instanceof Object) {
                        scope.actions = angular.extend({}, default_actions, callback);
                    } else {
                        scope.actions = default_actions;
                    }
                });

                scope.toggleAddFriends = function(ev) {
                    $mdDialog.show({
                            controller: AddFriendsDialogController,
                            templateUrl: "eklabs.angularStarterPack/modules/ttc-linker/directives/my-linker/addFriendsDialogView.html",
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: scope.customFullscreen,
                            locals: {
                                myUser: scope.userObject
                            }
                        })
                        .finally(function() {
                            scope.updateFriends();
                        });
                }

                function AddFriendsDialogController(scope, $mdDialog, myUser, User, Users) {

                    scope.myUser = myUser;

                    scope.addFriend = function(person) {
                        scope.myUser.sendRequest(person)
                        .then(
                            function(response) {
                                person = response;
                            },
                            function(error) {
                                console.log(error);
                            }
                        );
                    };

                    scope.updateFriends = function() {
                        scope.people = [];
                        var userlist = new Users();
                        userlist.fetch()
                            .then(function successCallback() {
                                scope.people = userlist.items.filter(function(p) {
                                    return ((p.id !== scope.myUser.id) && (scope.myUser.friends.indexOf(p.id) === -1));
                                });
                            }, function errorCallback(response) {
                                console.log(response);
                            });
                    }

                    scope.updateFriends();

                    scope.hide = function() {
                        $mdDialog.hide();
                    };

                    scope.cancel = function() {
                        $mdDialog.cancel();
                    };

                    scope.friendAdded = function(newFriend) {
                        $mdDialog.hide(newFriend);
                    };
                }


                scope.havingRequests = function() {
                    if (!scope.userObject) return false;
                    return ((scope.userObject.requests instanceof Array) && (scope.userObject.requests.length > 0));
                }

                scope.toggleMyRequests = function(ev) {
                    $mdDialog.show({
                            controller: myRequestsDialogController,
                            templateUrl: "eklabs.angularStarterPack/modules/ttc-linker/directives/my-linker/myRequestsDialogView.html",
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: scope.customFullscreen,
                            locals: {
                                myUser: scope.userObject
                            }
                        })
                        .finally(function() {
                            scope.updateFriends();
                        });
                }

                function myRequestsDialogController(scope, $mdDialog, myUser) {

                    scope.myUser = myUser;

                    scope.declineRequest = function(person) {
                        myUser.deleteRequest(person)
                        .finally(
                            function(){
                                scope.updateRequests();
                            }
                        );

                    }
                    scope.acceptRequest = function(person) {
                        myUser.acceptRequest(person)
                        .finally(
                            function(){
                                scope.updateRequests();
                            }
                        );
                    };

                    scope.updateRequests = function() {
                        scope.people = [];
                        var userlist = new Users();
                        userlist.fetch()
                            .then(function successCallback() {
                                scope.people = userlist.items.filter(function(p) {
                                    return ((p.id !== scope.myUser.id) && (scope.myUser.requests.indexOf(p.id) !== -1));
                                });
                                console.log(scope.people);

                            }, function errorCallback(response) {
                                console.log(response);
                            });
                    }

                    scope.updateRequests();

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
