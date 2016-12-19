'use strict';

angular.module('eklabs.angularStarterPack.ttc-linker')
    .factory('User', function($config, $http, $q) {

        var uri = $config.get('api') + '/users/';

        /**
         * Constructor
         * @param data
         * @constructor
         */
        var User = function(data) {
            if (data) {
                this.name = data.name;
                this.id = data.id;
                this.photo = data.photo;
                this.friends = angular.isArray(data.friends) ? data.friends : [];
                this.requests = angular.isArray(data.requests) ? data.requests : []
                this.status = data.status;
            }
        };

        User.prototype = Object.create({});
        User.prototype.constructor = User;

        /**
         * Access to id attribute
         * @returns {*}
         */
        User.prototype.getId = function() {
            return this.id;
        };

        /**
         * Manage case no photo ;)
         * @returns {*}
         */
        User.prototype.getPicture = function() {
            return (this.photo) ? this.photo : $config.get('defaultPhoto')
        };

        /**
         * Transform Object User to JSON for an API
         * @returns {{name: *, photo: *, birthdate: *}}
         */
        User.prototype.toApi = function() {
            return {
                name: this.name,
                photo: this.photo,
                birthdate: this.birthdate,
                friends: this.friends,
                requests: this.requests,
                status: this.status
            }
        };

        /**
         * Method to retrieve user information
         * @param id
         * @returns {*|jQuery.promise|promise.promise|Function|Promise}
         */
        User.prototype.get = function(id) {

            var defer = $q.defer(),
                accessUri = uri + (id ? id : (this.id) ? this.id : undefined);

            $http.get(accessUri).then(function(response) {
                var newUser = new User(response.data);
                defer.resolve(newUser);
            }, function(reason) {
                defer.reject(reason)
            });

            return defer.promise;
        };

        /**
         * Make a copy of the current item
         * @returns {User}
         */
        User.prototype.clone = function() {
            return new User(this);
        };

        /**
         * Update the current user
         * @returns {promise.promise|*|Function|jQuery.promise|Promise}
         */
        User.prototype.update = function(data) {
            var defer = $q.defer();

            $http.put(uri + this.getId(), data).then(function(response) {
                defer.resolve(response);
            }, function(reason) {
                defer.reject(reason)
            });

            return defer.promise;
        };

        /**
         * Method to retrieve user's friendlist
         *
         */
        User.prototype.getFriends = function() {
            var myFriends = [];
            this.friends.forEach(function(f) {
                User.prototype.get(f)
                    .then(
                        function successCallback(response) {
                            myFriends.push(response);
                        },
                        function errorCallback(response) {
                            return;
                        });
            });

            return myFriends;
        };

        /**
         * Method to retrieve user's friend requests list
         *
         */
        User.prototype.getRequests = function() {
            var myRequests = [];
            this.requests.forEach(function(f) {
                User.prototype.get(f)
                    .then(
                        function(result) {
                            myRequests.push(result);
                        },
                        function(error) {
                            return;
                        });
            });

            return myRequests;
        };

        User.prototype.deleteRequest = function(newFriend) {

            var defer = $q.defer();

            var newRequests = this.requests.filter(function(req) {
                return (req !== newFriend.id);
            });
            this.requests = null;

            this.update(this).then(
                function successCallback(response) {
                    this.requests = newRequests;
                    this.update(this).then(
                        function successCallback(response) {
                            defer.resolve(newRequests);
                        },
                        function errorCallback(response) {
                            defer.reject(response);
                        });
                },
                function errorCallback(response) {
                    defer.reject(response);
                });

            return defer.promise;
        };

        User.prototype.acceptRequest = function(newFriend) {
            var defer = $q.defer();
            var success = false;

            if (newFriend.friends.indexOf(this.id) === -1) {
                newFriend.friends.push(this.id);
            }
            if (this.friends.indexOf(newFriend.id) === -1) {
                this.friends.push(newFriend.id);
            }

            var myRequests = this.requests.filter(function(r) {
                return (r !== newFriend.id);
            });

            var newFriendRequests = newFriend.requests.filter(function(r) {
                return (r !== this.id);
            });
            newFriend.requests = null;
            this.requests = null;
            this.update(this)
                .then(
                    function(successCallback) {
                        this.requests = myRequests;
                        this.update(this).then(
                            function successCallback(response) {
                                success = true;
                            },
                            function errorCallback(response) {
                                defer.reject(response);
                            })
                    },
                    function(response) {
                        defer.reject(response);
                    });

            newFriend.update(newFriend)
                .then(
                    function(response) {
                        newFriend.requests = newFriendRequests;
                        newFriend.update(newFriend).then(
                            function successCallback(response) {
                                if (success) {
                                    success = true
                                }
                            },
                            function errorCallback(response) {
                                defer.reject(response);
                            })
                    },
                    function(response) {
                        defer.reject(response);
                    });

            if (success) {
                defer.resolve();
            }
            return defer.promise;
        };

        User.prototype.sendRequest = function(target) {

            var defer = $q.defer();

            if (target.requests.indexOf(this.id) == !-1) {
                defer.reject("Request already sent");
            }

            target.requests.push(this.id);

            target.update(target)
                .then(
                    function successCallback(response) {
                        defer.resolve(target);
                    },
                    function errorCallback(response) {
                        defer.reject(response);
                    });

            return defer.promise;
        }

        return User;

    });
