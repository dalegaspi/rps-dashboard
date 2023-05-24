
function zeroFill( number, width )
{
	width -= number.toString().length;
  	if ( width > 0 )
  	{
    	return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  	}
  	return number + ""; // always return a string
}

function getPlayerProperties(id, plist)
{
  	for (var i= 0; i < plist.length; i++)
  	{
    	if (plist[i].playerId == id)
      		return plist[i];
  	}
}

    
  angular.module('myApp', ['ui.router', 'ui.bootstrap','ngGrid','angularSpinner','googlechart'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider
          .otherwise('/board/1')
        
        
        var home = {
                name: 'home',
                url: '/',
                template: 'use /#/board/{boardno} KTHANXBAI',
                controller: function ($scope) {
                  
                  $scope.name = "World";
              }
            }
			
        var board = {
                name: 'board',
                url: '/board/{boardId:[0-9]{1,4}}',
                templateUrl: 'board.html',
                controller: ['$scope', '$stateParams', '$http', '$filter', '$timeout',
                  function ($scope, $stateParams, $http, $filter, $timeout) {
                  
                  $scope.isDetailsCollapsed = false;
                  $scope.isPlayersCollapsed = true;
                  $scope.isACCollapsed = true;
                  $scope.boardid = '...'
                  $scope.isloading = true;
                  $scope.boardCellSize = 20;
				  $scope.showWC = 'true'
				  $scope.coloredLabels = 'false'
				  $scope.showPanel = true;
             
				  
				  $scope.playerTableData = [];
			      $scope.gridOptions = { 
					  data: 'playerTableData',
					  columnDefs: [
					  	{field: "playerId", displayName:"#", maxWidth:3},
						{field: "name", displayName:"name"},
						{field: "score"},
						{field: "points"},
						{field: "wonSquares", displayName:"won squares"},
						{field: "numberAttacks", displayName:"attacks"},
						{field: "errorAttacks", displayName:"attack errors"},
						{field: "efficiency"}
					  ],
					  multiSelect: false
				  };
				  
				  
				  // chart begins
				  
				  $scope.chart = {
				    "type": "PieChart",
				    "displayed": true,
				    "cssStyle": "height:100%; width:100%; font-family:'Helvetica Neue'",
				    "data": {
				      "cols": [
				        {
				          "id": "name",
				          "label": "player",
				          "type": "string"
				        },
				        {
				          "id": "wonSquares",
				          "label": "Won Cells",
				          "type": "number"
				        }
				      ],
				      "rows": [
				        
				      ]
				    },
				    "options": {
				      "title": "most cells occupied",
				      "isStacked": "false",
				      "fill": 20,
				      "displayExactValues": true,
				      "vAxis": {
				        "title": "Sales unit",
				        "gridlines": {
				          "count": 10
				        }
				      },
				      "hAxis": {
				        "title": "Date"
				      },
					  
					  "is3D": false,
					  
					  
					  "colors": []
				    },
				    "formatters": {}
				  }
				  
				  
				  $scope.chart2 = {
				    "type": "PieChart",
				    "displayed": true,
				    "cssStyle": "height:100%; width:100%; font-family:'Helvetica Neue'",
				    "data": {
				      "cols": [
				        {
				          "id": "name",
				          "label": "player",
				          "type": "string"
				        },
				        {
				          "id": "points",
				          "label": "Points",
				          "type": "number"
				        }
				      ],
				      "rows": [
				        
				      ]
				    },
				    "options": {
				      "title": "most points",
				      "isStacked": "false",
				      "fill": 20,
				      "displayExactValues": true,
				      "vAxis": {
				        "title": "Sales unit",
				        "gridlines": {
				          "count": 10
				        }
				      },
				      "hAxis": {
				        "title": "Date"
				      },
					  
					  "is3D": false,
					  
					  
					  "colors": []
				    },
				    "formatters": {}
				  }
				  
				  // chart ends
				  
                  
                  var glurl = 'http://10.1.105.226:806/GamePlay.svc/gamelist/?playerAccessKey=eNoBAgD9%2fzI2AJwAaQ%3d%3d&callback=JSON_CALLBACK'
                  
                  $http.jsonp(glurl)
                    .success(function(data) {
                      $scope.boards = data.games
                    });
                  
                  
                  var url = 'http://10.1.105.226:806/GamePlay.svc/gameboard/' + $stateParams.boardId + '/?playerAccessKey=eNoBAgD9%2fzI2AJwAaQ%3d%3d&callback=JSON_CALLBACK'
                  console.log(url)
                  
                  var updateBoard = function() {
                  $scope.isloading = true;
                  $http.jsonp(url)
                      .success(function(data){
                          
                          $scope.numplayers = data.game.currentPlayers;
                          $scope.boardid = data.game.id;
                          $scope.gametype = data.game.gameType;
                          $scope.grows = data.game.rows;
                          $scope.gcols = data.game.cols;
                          $scope.opencells = data.game.openCells;
                          $scope.takencells = data.game.takenCells;
                          $scope.totalcells = data.game.totalCells;
                          $scope.players = data.game.players;
                          $scope.boardlocked = data.game.lockedGame;
                          
                          
                          // build the multi-dimentional array
                          
                          var board = new Array();
                          for (var r = 0; r < data.game.rows; r++)
                          {
                            console.log("BOARD");
                            //board[r] = zeroFill(data.game.gameCells[r].playerId, 4);
                              board[r] = new Array()
                            for (var c = 0; c < data.game.cols; c++)
                            {
                              //board[r][c] = zeroFill(data.game.gameCells[(r * data.game.cols) + c].playerId, 4);
                            board[r][c] = {
                              p: data.game.gameCells[(r * data.game.cols) + c].playerName,
                              wc: zeroFill(data.game.gameCells[(r * data.game.cols) + c].winCount, 3),
                              obj: data.game.gameCells[(r * data.game.cols) + c],
                              pobj: getPlayerProperties(data.game.gameCells[(r * data.game.cols) + c].playerId, data.game.players)
                              }
                            }
                          }
                          
						  
						  // chart
						  
						  console.log($scope.chart.data.rows)
						 
						  $scope.chart.data.rows = new Array();
						  $scope.chart2.data.rows = new Array();
						  var chartrows = new Array();
						  var chartrows2 = new Array();
						  for (var c = 0; c < data.game.players.length; c++)
						  {
							  chartrows[c] = {
								  	  c : [
		  				            		{
		  				              		  v: data.game.players[c].name
		  				            	  	},
		  				            		{
		  				              		  v: data.game.players[c].wonSquares
		  				            	  	}	
									  ]
								  
							  }
							  
							  chartrows2[c] = {
								  	  c : [
		  				            		{
		  				              		  v: data.game.players[c].name
		  				            	  	},
		  				            		{
		  				              		  v: data.game.players[c].points
		  				            	  	}	
									  ]
								  
							  }
							  
							  $scope.chart.options.colors[c] = data.game.players[c].color
							  $scope.chart2.options.colors[c] = data.game.players[c].color
						  }
						  
						  
						  console.log(chartrows)
						  $scope.chart.data.rows = chartrows;
						  $scope.chart2.data.rows = chartrows2;
						  
						  //
						  
                          $scope.board = board;
                          
                          var tdata = data.game.players;
						  
						  
						    	for (var i= 0; i < tdata.length; i++)
                  {
                    if (tdata[i].numberAttacks > 0)
                      tdata[i].efficiency = "" + (parseFloat((tdata[i].wonSquares / tdata[i].numberAttacks) * 100)).toFixed(2) + "%";                        
                     else
                      tdata[i].efficiency = "-"
                  }
              
						  $scope.playerTableData = tdata
						  
						  /*
                          $scope.tableParams = new ngTableParams({
                              page: 1,            // show first page
                              count: 100,          // count per page
                              
                              sorting: {
                                wonSquares: 'desc'     // initial sorting
                              }
                          }, {
                                counts: [], // hide page counts control
        total: 1,  // value less than count hide pagination
                                getData: function($defer, params) {
                                    // use build-in angular filter
                                    var orderedData = params.sorting() ?
                                                        $filter('orderBy')(tdata, params.orderBy()) :
                                                        tdata;

                                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                }
                          
                          });
						  */
                          $scope.isloading = false;
                          
                      });
                      
                    $timeout(updateBoard, 3000);
                  }
                  
                  $timeout(updateBoard, 3000);
                  
                  
                  
                    
                  }]
            } 
            
        
        $stateProvider.state(home);
        $stateProvider.state(board);
       
    }])
    .run(['$state',  function ( $state ) {
       console.log("start!")
       $state.transitionTo('board', { boardId: '1' }); 
    }])