var app = angular.module("myApp", ['ui.bootstrap', 'customDirectives'])

.controller("mainCtrl", function ($scope) {
	var userData = [{un: 'vikas', pwd: 'pwd', ph: '5108577006', id: 0},
			   {un: 'vinay', pwd: 'pwd2', ph: '5108577007', id: 1},
			   {un: 'sanj', pwd: 'pwd3', ph: '5108577008', id: 2},
               {un: 'abcd', pwd: 'pwd4', ph: '5108577009', id: 3}];

	$scope.userTable = {
		title : 'User table',
		cols: ['Username', 'Password', 'Contact'],
		order : ['un', 'pwd', 'ph'],
		rows: userData,
		id: 4,
		addRow: true,
		addTemplate: "utEditModal.html",
        addHandler: function (row) {
        	row.id = this.id++;
        	userData.push(row);
        },
        deleteRow: true,
        deleteHandler: function (row) {
        	for (var i = 0; i < userData.length; i++) {
        		if (userData[i].id == row.id) {
					userData.splice(i, 1);
					break;
        		}
     		}
        },
        editRow: true,
        editTemplate: "utEditModal.html",
        editHandler: function (row) {
        	for (var i = 0; i < userData.length; i++) {
        		if (userData[i].id == row.id) {
					userData[i] = row;
					break;
        		}
     		}
        },
        search: true
	};

	var ageData = [{un: 'vikas', age: '27', id: 0},
			   {un: 'vinay', age: '29', id: 1},
			   {un: 'sanj', age: '25', id: 2},
               {un: 'abcd', age: '30', id: 3}];
	$scope.ageTable = {
		title : 'Age table',
		cols: ['Username', 'Age'],
		order : ['un', 'age'],
		rows: ageData,
		addRow: true,
		id: 4,
		addTemplate: "atEditModal.html",
        addHandler: function (row) {
        	row.id = this.id++;
        	ageData.push(row);
        },
        deleteRow: true,
        deleteHandler: function (row) {
        	for (var i = 0; i < ageData.length; i++) {
        		if (ageData[i].id == row.id) {
					ageData.splice(i, 1);
					break;
        		}
     		}
        },
        editRow: true,
        editTemplate: "atEditModal.html",
        editHandler: function (row) {
        	for (var i = 0; i < ageData.length; i++) {
        		if (ageData[i].id == row.id) {
					ageData[i] = row;
					break;
        		}
     		}
        }
	};
});




angular.module('customDirectives', []).directive("atable", function () {
	return {
		restrict: "E",
		scope: {
			config: '='
		},
		template: [ '<table class="table table-striped table-condensed table-bordered"><thead><tr><th ng-repeat="col in config.cols" class="text-center">{{col | uppercase}}</th></tr></thead>',
					' <h3 class="text-center">{{config.title | uppercase}}</h3>',
					' <button ng-show="config.addRow" ng-click="open(\'add\')" class="btn btn-sm btn-primary"><span class="glyphicon glyphicon-plus"></span></button>',
					'<tbody><tr ng-repeat="row in config.rows">',
					'			<td ng-repeat="o in config.order">{{row[o]}}</td>',
					'			<td ng-show="config.deleteRow || config.editRow">',
					'  				<button ng-show="config.editRow" ng-click="open(\'edit\', row)" class="btn btn-sm btn-primary">Edit</button>',
					' 				<button ng-show="config.deleteRow" ng-click="open(\'delete\', row)" class="btn btn-sm btn-warning" data-toggle="modal" data-target="#delPane">Delete</button>',
					'			</td>',
					'		</tr>',
					'</tbody>',
					'</table>',
					'<!-- Delete Pane -->',
					'<script type="text/ng-template" id="deleteModal.html">',
					'	<div class="modal-header bg-primary">',
				    '		<button type="button" class="close" ng-click="cancel()">&times;</button>',
				    '		<h4 class="modal-title text-center">Are you sure about this delete?</h4>',
					'	</div>',
					'	<div class="modal-footer">',
		        	'		<button class="btn btn-warning" ng-click="ok()">Delete</button>',
		        	'		<button class="btn btn-default" ng-click="cancel()">Cancel</button>',
		      		'	</div>',	
					'</script>'].join(''),
		controller: function ($scope, $modal) {
			if ($scope.config.deleteRow || $scope.config.editRow) {
				$scope.config.cols.push('Edit');
			}

			var getModalConfig = function (type) {
  				var template = 'deleteModal.html';
				var controller = 'modalCtrl';

			    if (type == 'add' || type == 'edit') {
					template = (type == 'add') ? $scope.config.addTemplate : $scope.config.editTemplate;
			    }

				var config = {};
				config.animation = true;
				config.templateUrl = template;
				config.controller = controller;
				config.resolve = { 
					currActiveRow: function () {
			    	    return $scope.currActiveRow;
			    	}
			    };
			    return config;
			};

			$scope.open = function (type, row) {
				// Save the current row which is being operated on
				$scope.currActiveRow = row ? angular.copy(row) : {};
				// Open new model instance and handle modal close
			    var modalInstance = $modal.open(getModalConfig(type));
		    	modalInstance.result.then(function (currActiveRow) {
			    	if (type == 'add') {
						$scope.config.addHandler(currActiveRow);
			    	} else if (type == 'edit') {
						$scope.config.editHandler(currActiveRow);
			    	} else if (type == 'delete') {
						$scope.config.deleteHandler(currActiveRow);
			    	}
			   	});
		    };
		}
	}
})

.controller('modalCtrl', function ($scope, $modalInstance, currActiveRow) {

	$scope.currActiveRow = currActiveRow;

  	$scope.ok = function () {
 		$modalInstance.close($scope.currActiveRow);
  	};

  	$scope.cancel = function () {
    	$modalInstance.dismiss('cancel');
  	};
})

