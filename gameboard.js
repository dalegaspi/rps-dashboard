function boardGameCtrl($scope, $http) 
{
    var url = "http://10.1.105.226:806/GamePlay.svc/gameboard/2/?playerAccessKey=cGxheWVySWQ9MTM%3d&callback=JSON_CALLBACK"
    
    
    $http.jsonp(url)
        .success(function(data){
            $scope.cells = data.game.gameCells;
        });
    
};