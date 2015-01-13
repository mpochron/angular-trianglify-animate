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
			if($element[0].tagName === "IMG" && window.File && window.FileList && window.FileReader){
				var $e = $element[0] , $p = $element[0].parentNode;
				var xhr = new XMLHttpRequest();
				xhr.open("GET", $e.src, false);
				xhr.responseType = "xml";
				xhr.onload = response;
		
				function response(e){
					var parser, xmlDoc;
					if (window.XMLHttpRequest){ // Chorme, Firefox, Opera
						parser=new DOMParser();
						xmlDoc = parser.parseFromString(e.srcElement.response,"text/xml");
					}else{ // IE
						xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
						xmlDoc.async=false;
						xmlDoc.loadXML(e.srcElement.response); 
					}

					svg = xmlDoc.getElementsByTagName("svg")[0];
					svg.setAttribute('ng-trianglify-animate','');
					for(var i=0; i<$e.attributes.length; i++){
						svg.setAttribute($e.attributes[i].nodeName,$e.attributes[i].value);
					}
					svg = angular.element(svg);
					$element.replaceWith(svg);
					$compile(svg)($scope);
					$element = svg;
				}
				xhr.send();
				return true;
			}
			
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
			
			var el_paths = $element[0].getElementsByTagName('path');
			var paths = [], path;
			for(var i=0; i<el_paths.length; i++){
				path = paths[i] = el_paths[i].pathSegList;
				path = angular.element(path);
				$compile(path)($scope);
			}
			
			$scope.points = polys;
			$scope.paths = paths;
			$scope.pathPassSymbols = "MZLHV"
			$scope.theta = 0;
			$scope.animate = $interval(function() {
				// polygons
				for(var i = 0; i < $scope.points.length; i++) {
					var point = $scope.points[i];
					point.y1 = point.y1 + Math.sin($scope.theta + scale(point.x1, 0, 500, 0, 2 * Math.PI)) * 0.5;
					point.y2 = point.y2 + Math.sin($scope.theta + scale(point.x2, 0, 500, 0, 2 * Math.PI)) * 0.5;
					point.y3 = point.y3 + Math.sin($scope.theta + scale(point.x3, 0, 500, 0, 2 * Math.PI)) * 0.5;
				}
				// path
				for(var i = 0; i < $scope.paths.length; i++) {
					$path = $scope.paths[i];
					for(var q=0; q<$path.length; q++){
						if($scope.pathPassSymbols.indexOf($path[q].pathSegTypeAsLetter) > -1){
							$path[q].y = $path[q].y + Math.sin($scope.theta + scale($path[q].x, 0, 500, 0, 2 * Math.PI)) * 0.5;
						}
					}
				}	
				// todo: circle, rect, ellipse, line, polyline
				$scope.theta += 0.04;
			}, 10);
		}
	};
}]);