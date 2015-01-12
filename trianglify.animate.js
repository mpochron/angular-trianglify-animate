// Trianglify Animate
// https://github.com/machei/angular-trianglify-animate
// @author: machei
// @thanks: grohlf & empathetic-alligator 

function scale(valueIn, baseMin, baseMax, limitMin, limitMax) {
    return ((limitMax - limitMin) * (valueIn - baseMin) / (baseMax - baseMin)) + limitMin;
}

var app = angular.module('TriApp', []);

app.directive("ngTrianglifyAnimate", ["$interval", "$compile", function($interval, $compile) {
    return {
		restrict:'A',
		link: function($scope, $element, $attrs) {
		
			var polygons = $element[0].getElementsByTagName('polygon');
			var polys = [];
			for(var i=0; i<polygons.length; i++){
				polygon = polygons[i];
				p = polygon.points;
				polygon = angular.element(polygon);
				polygon.attr("ng-class","{{point=points["+i+"]}}");
				polygon.attr("ng-attr-points","{{point.x1}},{{point.y1}} {{point.x2}},{{point.y2}} {{point.x3}},{{point.y3}}");
				$compile(polygon)($scope);
				polys[i] = {x1:p[0].x ,y1:p[0].y, x2:p[1].x, y2:p[1].y, x3:p[2].x , y3:p[2].y};
			}
			
			$scope.points = polys;
			$scope.theta = 0;
			$scope.animate = $interval(function() {
				for(var i = 0; i < $scope.points.length; i++) {
					var point = $scope.points[i];
					$scope.points[i].y1 = point.y1 + Math.sin($scope.theta + scale(point.x1, 0, 500, 0, 2 * Math.PI)) * 0.5;
					$scope.points[i].y2 = point.y2 + Math.sin($scope.theta + scale(point.x2, 0, 500, 0, 2 * Math.PI)) * 0.5;
					$scope.points[i].y3 = point.y3 + Math.sin($scope.theta + scale(point.x3, 0, 500, 0, 2 * Math.PI)) * 0.5;
				}
				$scope.theta += 0.04;
			}, 10);
		}
	};
}]);