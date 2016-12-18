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
                                getFriends()
                                    .then(function(result) {
                                            scope.userFriends = result;
                                            // console.log(scope.userFriends);
                                        },
                                        function(error) {
                                            scope.userFriends = [];
                                        });
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
                        .then(function(newFriend) {

                        }, function() {

                        });
                }

                function AddFriendsDialogController(scope, $mdDialog, myUser) {

                    scope.myUser = myUser;


                    scope.addFriend = function(person) {
                        if (!person.requests) {
                            person.requests = [];
                        }
                        if (person.requests.indexOf(myUser.id) == !-1) {
                            return
                        }
                        var updatedPerson = person;
                        updatedPerson.requests.push(myUser.id);

                        $http({
                            method: "PUT",
                            url: userRoute + person.id,
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
                    }).then(function successCallback(response) {
                        // console.log(response)
                        scope.people = response.data;
                        scope.people = scope.people.filter(function(p) {
                            return ((typeof p == "object") && (p.id !== scope.myUser.id) && (scope.myUser.friends.indexOf(p.id) === -1));
                        });

                    }, function errorCallback(response) {
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
                        .then(function(newFriend) {

                        }, function() {

                        });
                }

                function myRequestsDialogController(scope, $mdDialog, myUser) {

                    scope.myUser = myUser;

                    scope.declineRequest = function(person) {
                        if (myUser.requests.indexOf(person.id) === -1) {
                            return;
                        }

                        myUser.requests = myUser.requests.filter(function(r) {
                            return (r !== person.id)
                        })

                        var newRequests = myUser.requests;
                        myUser.requests = null;

                        $http({
                            method: "PUT",
                            url: userRoute + myUser.id,
                            data: myUser
                        }).then(
                            function successCallback(response) {
                                myUser.requests = newRequests;
                                $http({
                                    method: "PUT",
                                    url: userRoute + myUser.id,
                                    data: myUser
                                }).then(
                                    function successCallback(response) {
                                        scope.updateRequests();
                                        // console.log("updated1 :", response)
                                    },
                                    function errorCallback(response) {
                                        console.log(response);
                                    });
                                // console.log("updated1 :", response)
                            },
                            function errorCallback(response) {
                                console.log(response);
                            });
                    }
                    scope.acceptRequest = function(person) {

                        if (!person.friends) {
                            person.friends = [];
                        }
                        if (!myUser.friends) {
                            myUser.friends = [];
                        }
                        if ((person.friends.indexOf(myUser.id) == !-1) && (myUser.friends.indexOf(person.id) == !-1)) {
                            return;
                        }

                        var updatedPerson = person;
                        updatedPerson.friends.push(myUser.id);

                        myUser.friends.push(updatedPerson.id);

                        var newRequests = myUser.requests;

                        newRequests = newRequests.filter(function(r) {
                            return (r !== person.id);
                        });

                        myUser.requests = null;

                        $http({
                            method: "PUT",
                            url: userRoute + person.id,
                            data: updatedPerson
                        }).then(
                            function successCallback(response) {
                                person = updatedPerson;
                                console.log("updated1 :", response)
                            },
                            function errorCallback(response) {
                                console.log(response);
                            });

                        $http({
                            method: "PUT",
                            url: userRoute + myUser.id,
                            data: myUser
                        }).then(
                            function successCallback(response) {
                                console.log("updated2:", response)
                                myUser.requests = newRequests;
                                $http({
                                    method: "PUT",
                                    url: userRoute + myUser.id,
                                    data: myUser
                                }).then(
                                    function successCallback(response) {
                                        scope.updateRequests();
                                    },
                                    function errorCallback(response) {});
                            },
                            function errorCallback(response) {
                                console.log(response);
                            });

                    };

                    scope.updateRequests = function() {
                        scope.people = [];

                        $http({
                            method: "GET",
                            url: userRoute,
                        }).then(function successCallback(response) {
                            // console.log(response)
                            scope.people = response.data;
                            scope.people = scope.people.filter(function(p) {
                                return ((typeof p == "object") && (p.id !== scope.myUser.id) && (scope.myUser.requests.indexOf(p.id) !== -1));
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
