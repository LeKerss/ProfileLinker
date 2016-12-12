'use strict';

'use strict';

angular.module('demoApp')
    .controller('linkerCtrl', function($log,$scope,$mdDialog){


        // ----------------------------------------------------------------------------------------------------
        // ---- PARAMS CATALOGUE
        // ----------------------------------------------------------------------------------------------------
        // Fonction permettant de récupérer un utilisateur via son id





      $scope.params = [{
          /**
           * Default
           */
          case        : 'Default Case',
          user        : undefined,
          callback    : undefined
      },{
          /**
           * Case user
           */
          case       : 'Case Annas',
          user    : 1,
          callback : {
              onValid : function(user){
                  displayCode('onValid', user)
              }
          }
      },
      {
          /**
           * Case user
           */
          case       : 'Case Cecile',
          user    : 2,
          callback : {
              onValid : function(user){
                  displayCode('onValid', user)
              }
          }
      },
      {
          /**
           * Case user
           */
          case       : 'Case Ludo',
          user    : 3,
          callback : {
              onValid : function(user){
                  displayCode('onValid', user)
              }
          }
      }
      ];

        $scope.chooseParams = function(index){
            // --- Define current status
            $scope.myUser    = $scope.params[index].user;
            $scope.myCallback = $scope.params[index].callback

            $scope.index          = index;
            $scope.refresh        = moment().valueOf();
            $scope.haveResult     = false;
        };

        // --- Init
        $scope.chooseParams(0);

        // --- Update result viewer
        var displayCode = function(from,code,isError){

            $scope.haveResult   = true;

            $scope.result       = {
                code : code,
                isError : isError,
                title : from
            };
        };
        // ----------------------------------------------------------------------------------------------------
        // ---- DISPLAY CODE MODE
        // ----------------------------------------------------------------------------------------------------
        $scope.displayCode  = false;
        $scope.maxHeight    = $(window).height() - 250;

        $scope.showCode = function(){
            $scope.displayCode = !$scope.displayCode;
        };

        /**
         * Page description
         * @type {{title: string, icon: string, haveCodeSource: boolean}}
         */
        $scope.page         = {
            title : 'directive Profile Linker',
            haveCodeSource : true,
            code : [{
                link : 'pages/linker/code/directive.html',
                language : 'html',
                title : 'Code HTML de la directive profile-linker'
            },{
                link : 'pages/linker/code/contract.json',
                language : 'json',
                title : 'Params available for the directive profile-linker'
            }]
        };

        /**
         * MODE Fullscreen
         */
        $scope.fullScreenMode = true;
        $scope.hideParams     = false;
        $scope.fullScreen = function(){
            $scope.hideParams = !$scope.hideParams;
        };

    });
