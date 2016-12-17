'use strict';

angular.module('eklabs.angularStarterPack.ttc-linker')
    .factory('User', function($config,$http,$q){

        var uri = $config.get('api')+'/users/';

        /**
         * Constructor
         * @param data
         * @constructor
         */
        var User  = function (data){
            if(data){
                this.name       = data.name;
                this.id         = data.id;
                this.photo      = data.photo;
                this.friends    = data.friends;
                this.requests   = data.requests
            }
        };

        User.prototype = Object.create({});
        User.prototype.constructor = User;

        /**
         * Access to id attribute
         * @returns {*}
         */
        User.prototype.getId = function(){
            return this.id;
        };

        /**
         * Manage case no photo ;)
         * @returns {*}
         */
        User.prototype.getPicture = function(){
            return (this.photo) ? this.photo : $config.get('defaultPhoto')
        };

        /**
         * Transform Object User to JSON for an API
         * @returns {{name: *, photo: *, birthdate: *}}
         */
        User.prototype.toApi = function(){
            return {
                name        : this.name,
                photo       : this.photo,
                birthdate   : this.birthdate,
                friends     : this.friends,
                requests    : data.requests
            }
        };

        /**
         * Method to retrieve user information
         * @param id
         * @returns {*|jQuery.promise|promise.promise|Function|Promise}
         */
        User.prototype.get = function(id){

            var defer       = $q.defer(),
                accessUri   = uri + (id ? id : (this.id) ? this.id : undefined);

            $http.get(accessUri).then(function(response){
                var newUser = new User(response.data);
                if(!(newUser.friends instanceof Array)){
                    newUser.friends = [];
                }
                if(!(newUser.requests instanceof Array)){
                    newUser.requests = [];
                }
                defer.resolve(newUser);
            },function(reason){
                defer.reject(reason)
            });

            return defer.promise;
        };

        /**
         * Make a copy of the current item
         * @returns {User}
         */
        User.prototype.clone = function(){
            return new User(this);
        };

        /**
         * Method to retrieve user's friendlist
         *
         */
        User.prototype.getFriends = function(){

            var defer       = $q.defer(),
                accessUri   = uri + (id ? id : (this.id) ? this.id : undefined);

            var friendsList = [];

            friendsList = this.friends.map(function(f){
                return getUser(f);
            });

            defer.resolve(friendsList);
            return defer.promise;
        };

        /**
         * Method to retrieve user's friend requests list
         *
         */
        User.prototype.getRequests = function(){

            var defer       = $q.defer(),
                accessUri   = uri + (id ? id : (this.id) ? this.id : undefined);

            var requestList = [];

            friendsList = this.requests.map(function(f){
                return getUser(f);
            });

            defer.resolve(requestList);
            return defer.promise;
        };

        return User;

    });
