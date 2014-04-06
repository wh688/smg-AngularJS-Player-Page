'use strict';

/* Controllers */

var playerControllers = angular.module('playerControllers', []);

/* playerControllers.controller('HistoryListCtrl', ['$scope', '$rootScope', '$window','$http',
  function ($scope, $rootScope, $window, $http) {
      $scope.inquireHistory = function () {
          $http.get('http://2.smg-server.appspot.com/playerGame?playerId=' + $rootScope.logPlayerId + '&gameId=' + $scope.targetGameId+'&targetId='
            +$scope.targetPlayerId+'&accessSignature='+$rootScope.accessSignature)
          //$http.get('/historys/' + $scope.targetPlayerId + '/' + $scope.targetGameId + ".json")
              .success(function (data) {
                  $rootScope.historyProfile = data;
              }).then(function () {
                  $scope.inquireHistoryResponse();
              });
      };

      $scope.inquireHistoryResponse = function () {
          //if $rootScope.historyProfile.error exists
          if ($rootScope.historyProfile.error) {
              $window.alert($rootScope.historyProfile.error)
          } else if ($rootScope.historyProfile.token) {
              $rootScope.historyProfile.playerId = $scope.targetPlayerId;
              $rootScope.historyProfile.gameId = $scope.targetGameId;
              $window.alert("Your token number is: " + $rootScope.historyProfile.token + "; Your high score is: " + $rootScope.historyProfile.highscore + ".")
          } else {
              $rootScope.historyProfile.playerId = $scope.targetPlayerId;
              $rootScope.historyProfile.gameId = $scope.targetGameId;
              $window.alert("This player's high score is: " + $rootScope.historyProfile.highscore)
          }
      };

  }]); */

playerControllers.controller('HistoryDetailCtrl', ['$scope', '$rootScope', '$window', '$location', '$http',
  function ($scope, $rootScope, $window, $location, $http) {
      // inquire info/token/score
    //$scope.inquireInfo = function () {
      $http.get('http://2.smg-server.appspot.com/playerGame?playerId=' + $rootScope.profile.playerId + '&gameId=' + $rootScope.currentGameId + 
        '&targetId=' + $rootScope.profile.playerId + '&accessSignature=' + $rootScope.profile.accessSignature)
          .success(function (data) {
              $rootScope.infoProfile = data;
          })
          .then(function () {
              $scope.inquireInfoResponse();
          });
      //};

      $scope.inquireInfoResponse = function () {
          //if $rootScope.historyProfile.error exists
          if ($rootScope.infoProfile.error) {
              $window.alert($rootScope.infoProfile.error);
              $rootScope.infoProfile.error = ""
          /*} else if ($rootScope.infoProfile.token) {
              $rootScope.infoProfile.playerId = $scope.targetPlayerId;
              $rootScope.infoProfile.gameId = $scope.targetGameId;
              $window.alert("Your token number is: " + $rootScope.infoProfile.token + "; Your high score is: " + $rootScope.infoProfile.highscore + ".")
          } else {
              $rootScope.infoProfile.playerId = $scope.targetPlayerId;
              $rootScope.infoProfile.gameId = $scope.targetGameId;
              $window.alert("This player's high score is: " + $rootScope.infoProfile.highscore) */
          }
      };


      //$scope.inquireHistoryDetail = function () {
      /*$http.get('http://2.smg-server.appspot.com/history?playerId=' + $rootScope.profile.playerId + '&gameId=' + $scope.targetGameId +
        '&targetId=' + $rootScope.profile.playerId + '&accessSignature=' + $rootScope.profile.accessSignature) */
      $http.get('http://2.smg-server.appspot.com/history?playerId=' + $rootScope.profile.playerId + '&targetId=' + $rootScope.profile.playerId + 
        '&gameId=' + $rootScope.currentGameId + '&accessSignature=' + $rootScope.profile.accessSignature)
      //$http.get('../historys/' + $scope.targetPlayerId + '/' + $scope.targetGameId + ".json")
        .success(function (data) {
            $rootScope.historyDetailProfile = data;
        })
        .then(function () {
            $scope.inquireHistoryDetailResponse();
        });
      //};

      $scope.inquireHistoryDetailResponse = function () {
          // if historyDetailProfile.error exists
          if ($rootScope.historyDetailProfile.error) {
              $window.alert($rootScope.historyDetailProfile.error);
              $rootScope.historyDetailProfile = ""
          }
          // this is only when playerId=targetId
          else {
                //$rootScope.playerId = $scope.targetPlayerId;
                //$rootScope.gameId = $scope.targetGameId;
                $rootScope.histories = $rootScope.historyDetailProfile.history;
                //$location.path('/history:gameId')
          }
      };

  }]);
  
playerControllers.controller('ProfileCtrl', ['$scope', '$rootScope', 'Profile', '$window', '$routeParams', '$location', '$http',
  function($scope, $rootScope, Profile, $window, $routeParams, $location, $http) {

    $scope.login = function () {
    //$scope.profile = Profile.get({playerId: $routeParams.playerId});
        //$rootScope.profile = Profile.get({playerId: $scope.logPlayerId, password: $scope.logPassword});
        
      $http.get('http://2.smg-server.appspot.com/players/' + $scope.logPlayerId + '?password=' + $scope.logPassword)
        .success(function(data) {
            $rootScope.profile = data;
        })
        .then(function() {
          $scope.loginResponse();
      });
  };

  $scope.loginResponse = function () {
    if ($scope.profile.error == "WRONG_PASSWORD") {
      $window.alert("Failed. Wrong password.");
      $rootScope.profile.error = ""
    } else if ($scope.profile.error == "WRONG_PLAYER_ID") {
      $window.alert("Failed. Wrong player ID.");
      $rootScope.profile.error = ""
    } else if ($scope.profile.accessSignature != null) {
      $rootScope.profile.playerId = $scope.logPlayerId;
      $rootScope.profile.password = $scope.logPassword;
      $http.get('http://2.smg-server.appspot.com/playerInfo?playerId=' + $scope.profile.playerId + '&targetId=' + $scope.profile.playerId
        + '&accessSignature=' + $scope.profile.accessSignature)
        .success(function(data) {
          $rootScope.profile.email = data.email;
          $rootScope.profile.firstname = data.firstname;
          $rootScope.profile.lastname = data.lastname;
          $rootScope.profile.nickname = data.nickname;
        })
        .then(function() {
          $scope.loadProfile();
      });
    };
  };

  $scope.loadProfile = function () {
    if ($scope.profile.error == "WRONG_ACCESS_SIGNATURE") {
      $window.alert("Failed. Wrong access signature.");
      $rootScope.profile.error = ""
    } else if ($scope.profile.nickname != null) {
      $location.path("/profile") 
    };
  };

  $scope.edit = function () {
      if ($scope.profilePassword == null) 
      $scope.profilePassword = $scope.profile.password; 
      if ($scope.profileFirstname == null) 
      $scope.profileFirstname = $scope.profile.firstname;     
      if ($scope.profileLastname == null) 
      $scope.profileLastname = $scope.profile.lastname;   
      if ($scope.profileNickname == null) 
      $scope.profileNickname = $scope.profile.nickname;
    if ($scope.profileEmail == null)
      $scope.profileEmail = $scope.profile.email;
    if ($scope.profilePicUrl == null)
        $scope.profilePicUrl = $scope.profile.pictureUrl;
    $scope.newProfile = {
      "playerId" : $scope.profile.playerId,
      "accessSignature" : $scope.profile.accessSignature,
      "password" : $scope.profilePassword,
      "firstname" : $scope.profileFirstname,
      "lastname" : $scope.profileLastname,
      "nickname" : $scope.profileNickname,
      "email" : $scope.profileEmail,
      "pictureUrl" : $scope.profilePicUrl
    };
    $scope.newProfileStr = angular.toJson($scope.newProfile);
      //Profile.save({playerId:$scope.profile.playerId}, newProfileStr)
      $http.put('http://2.smg-server.appspot.com/players/' + $scope.profile.playerId, $scope.newProfileStr)
        .success(function(data) {
          $scope.editResponse = data;
        })
        .then(function() {
          $scope.etResponse();
        });
  };

  $scope.etResponse = function() {
      if ($scope.editResponse.success == "UPDATED_PLAYER") {
            $window.alert("Edit profile successfully!");
            $location.path("/profile");
            //The profile should receive from the server when the API supports all the attributes -- Pinji
            $rootScope.profile = $scope.newProfile;
    } else if ($scope.editResponse.error == "WRONG_ACCESS_SIGNATURE") {
      $window.alert("Failed. Wrong access signature.");
      $scope.editResponse.error = ""
    } else if ($scope.editResponse.error == "WRONG_PLAYER_ID") {
      $window.alert("Failed. Wrong player ID.");
      $scope.editResponse.error = ""
    } 
  };

  $scope.delete = function() {
    //var deleteResponse = Profile.delete({playerId:$scope.profile.playerId, accessSignature:$scope.profile.accessSignature});
    $http.delete('http://2.smg-server.appspot.com/players/' + $scope.profile.playerId + '?accessSignature=' + $scope.profile.accessSignature)
        .success(function(data) {
            $scope.deleteResponse = data;
        })
        .then(function() {
          $scope.dltResponse();
      });
  };

  $scope.dltResponse = function() {
      if ($scope.deleteResponse.success == "DELETED_PLAYER") {
            $window.alert("Delete account successfully!");
            $location.path("/login");
    } else if ($scope.deleteResponse.error == "WRONG_ACCESS_SIGNATURE") {
      $window.alert("Failed. Wrong access signature.");
      $scope.deleteResponse.error = ""
    } else if ($scope.deleteResponse.error == "WRONG_PLAYER_ID") {
      $window.alert("Failed. Wrong player ID.");
      $scope.deleteResponse.error = ""
    }   
  };

  $scope.logout = function() {
    $rootScope = {};
    $location.path("/login");
  };

  /* $scope.init = function() {
    if ((!($location.path() == "/login" || $location.path() == "/signup")) && angular.isUndefined($scope.profile.accessSignature)) {
      $rootScope.loginFail = true;
      $location.path("/login");
      $rootScope.$apply();
    }
  };
  $scope.init();  */
  }]);

playerControllers.controller('GameListCtrl', ['$scope', '$rootScope', '$http',
  function($scope, $rootScope, $http) {
    $http.get('http://2.smg-server.appspot.com/gameinfo/all')
        .success(function (data) {
          $rootScope.games = data;
        });
    $scope.orderProp = 'gameName';
  }]);

playerControllers.controller('GameStatsCtrl', ['$scope', '$routeParams', '$http', '$window', '$rootScope', 
  function($scope, $routeParams, $http, $window, $rootScope) {

    //$scope.gameStats = function () {
    $http.get('http://2.smg-server.appspot.com/gameinfo/stats?gameId=' + $routeParams.gameId)
    .success(function(data) {
      $scope.game = data;
    }).then(function(game) {
      if ($scope.game.error == "NO_MATCH_RECORDS") {
        $window.alert("NO_MATCH_RECORDS, No body played yet!");
        $scope.game.error = ""
      } else if ($scope.game.error == "WRONG_GAME_ID") {
        $window.alert("WRONG_GAME_ID, No such game!");
        $scope.game.error = ""
      }
    });
    //}

    $scope.rate = function () {
      $rootScope.createRate = {
        /*"playerId" : $rootScope.profile.playerId,
        "accessSignature" : $rootScope.profile.accessSignature, */
        "rating" : $scope.rating
      };
      $rootScope.createRateStr = angular.toJson($scope.createRate);

      $http({
        method: 'POST',
        url: 'http://2.smg-server.appspot.com/gameinfo/rating?gameId=' + $rootScope.currentGameId + 
        '&playerId=' + $rootScope.profile.playerId + '&accessSignature=' + $rootScope.profile.accessSignature,
        data: $rootScope.createRateStr,
        headers: {'Content-Type': 'application/json'}
      })
      .success(function(data) {
        $rootScope.rateResponse = data;
      })
      .then(function() {
        $scope.rtResponse(); 
      });
    };

    $scope.rtResponse = function () {
      if ($scope.rateResponse.error == "WRONG_RATING") {
        $window.alert("Failed. The rating is incorrectly formatted.");
        $scope.rateResponse.error = ""
      } else if ($scope.rateResponse.error == "WRONG_GAME_ID") {
        $window.alert("Failed. The gameId is wrong.");
        $scope.rateResponse.error = ""
      } else if ($scope.rateResponse.error == "WRONG_ACCESS_INFO") {
        $window.alert("Failed. The player access info is wrong.");
        $scope.rateResponse.error = ""
      } else if ($scope.rateResponse.rating != null) {
        $window.alert("Thank you for the rate for " + $rootScope.gamedetail.gameName);
      };
    };
    
  }]);

playerControllers.controller('GameDetailCtrl', ['$scope', '$routeParams', '$http', '$window', '$rootScope',
  function($scope, $routeParams, $http, $window, $rootScope) {
    $http.get('http://2.smg-server.appspot.com/games/' + $routeParams.gameId)
    .success(function(data) {
      $rootScope.gamedetail = data;
      $rootScope.currentGameId = $routeParams.gameId;
    }).then(function(gamedetail) {
      if ($rootScope.gamedetail.error == "WRONG_GAME_ID") {
        $window.alert("WRONG_GAME_ID, No such game!");
        $rootScope.gamedetail.error = ""
      }
    });
  }]);

playerControllers.controller('SignUpCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$window', '$location',
  function($scope, $rootScope, $routeParams, $http, $window, $location) {
  $scope.signup = function () {
    $rootScope.createProfile = {
      "email" : $scope.suEmail,
      "password" : $scope.suPassword,
      "firstname" : $scope.suFirstname,
      "lastname" : $scope.suLastname,
      "nickname" : $scope.suNickname,
      "pictureUrl" : $scope.suPicUrl
    };
    $rootScope.createProfileStr = angular.toJson($scope.createProfile);

    $http({
        method: 'POST',
        url: 'http://2.smg-server.appspot.com/players',
        data: $scope.createProfileStr,
        headers: {'Content-Type': 'application/json'}
    })
    .success(function(data) {
      $rootScope.signupResponse = data;
    })
    .then(function() {
      $scope.suResponse(); 
    });
    };

    $scope.suResponse = function () {
    if ($scope.signupResponse.error == "EMAIL_EXISTS") {
      $window.alert("Failed. The email already exists.");
      $scope.signupResponse.error = ""
    } else if ($scope.signupResponse.error == "PASSWORD_TOO_SHORT") {
      $window.alert("Failed. The password is too short. Please use at least 6 characters.")
      $scope.signupResponse.error = ""
    } else if ($scope.signupResponse.accessSignature != null) {
      $window.alert("Welcome, new player! Please remember your player ID:" + $scope.signupResponse.playerId);
      $rootScope.profile = $rootScope.createProfile;
      $rootScope.profile.playerId = $scope.signupResponse.playerId;
      $rootScope.profile.accessSignature = $scope.signupResponse.accessSignature;
            $location.path("/profile") 
    };
    };
  }]);
/*
  playerControllers.controller('RateCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$window', '$location',
    function($scope, $rootScope, $routeParams, $http, $window, $location) {
      $scope.rate = function () {
        $rootScope.createRate = {
          "rate" : $scope.rate
        };
        $rootScope.createRateStr = angular.toJson($scope.createRate);
        $http({
          method: 'POST',
          url: 'http://1.smg-server.appspot.com/gameinfo/rating?gameId' + $scope.gameId + 
            '&playerId=' + $scope.playerId + '&accessSignature=' + $scope.accessSignature,
          data: $scope.createRateStr,
          headers: {'Content-Type': 'application/json'}
         })
         .success(function(data) {
           $rootScope.rateResponse = data;
         })
        .then(function() {
          $scope.rtResponse(); 
         });
      };
      $scope.rtResponse = function () {
        if ($scope.rateResponse.error == "WRONG_RATING") {
          $window.alert("Failed. The rating is incorrectly formatted.")
        } else if ($scope.rateResponse.error == "WRONG_GAME_ID") {
          $window.alert("Failed. The gameId is wrong.")
        } else if ($scope.rateResponse.error == "WRONG_ACCESS_INFO") {
          $window.alert("Failed. The player access info is wrong.")
        } else if ($scope.signupResponse.accessSignature != null) {
          $window.alert("Thank you for the rate for " + $scope.rateResponse.gameId);
          $rootScope.rate = $rootScope.createRate;
          $rootScope.rate.gameId = $scope.rateResponse.gameId;
          $rootScope.rate.playerId = $scope.rateResponse.playerId;
          $rootScope.rate.accessSignature = $scope.rateResponse.accessSignature;
        };
      };
  }]);
  */