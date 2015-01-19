/* 
 * Angular Trianglify Animate
 * github: https://github.com/machei/angular-trianglify-animate
 * @author: machei
 * @thanks: grohlf & empathetic-alligator 
 */
 
function scale(valueIn, baseMin, baseMax, limitMin, limitMax) {
    return ((limitMax - limitMin) * (valueIn - baseMin) / (baseMax - baseMin)) + limitMin;
}

angular.module('moduleTrianglifyAnimate', [])
.constant('configTrianglifyAnimate', {
	speed:1, 
	vectorX: 1, 
	vectorY: 1, 
	baseMax: 0, 
	baseMin: 500, 
	theta: 0.4,
	pathPassSymbols : 'MZLHmzlh'
})
.directive("ngTrianglifyAnimate", ["$compile", function($compile) {
	return {
		restrict:'EA',
		scope:{
			interval: '='
		},
		controller: ['$scope', '$element', '$attrs', '$interval', 'configTrianglifyAnimate', function ($scope, $element, $attrs, $interval, configTrianglifyAnimate) {
			// Replace img with svg
			if($element[0].tagName === "IMG" && window.File && window.FileList && window.FileReader){
				var $e = $element[0] , $p = $element[0].parentNode;
				var xhr = new XMLHttpRequest();
				xhr.open("GET", $e.src, false);
				xhr.responseType = "xml";		
				function response(e){
					var parser, xmlDoc;
					if (window.XMLHttpRequest){ // Chorme, Firefox, Opera
						parser=new DOMParser();
						xmlDoc = parser.parseFromString(e.target.response,"text/xml");
					}else{ // IE
						xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
						xmlDoc.async=false;
						xmlDoc.loadXML(e.target.response); 
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
				xhr.onload = response; // error on firefox
				xhr.send();
				return true;
			}
			
			// Attrs			
			angular.forEach(['speed', 'vectorX', 'vectorY', 'baseMax', 'baseMin', 'theta'], function( key, index ) {
				$scope[key] = angular.isDefined($attrs[key]) ? (index < 6 ? $attrs[key] : $scope.$parent.$eval($attrs[key])) : configTrianglifyAnimate[key];
			});

			// Init Shapes
			var polygons = $element[0].getElementsByTagName('polygon');
			var polys = [];
			for(var i=0; i<polygons.length; i++){
				// Chrome&Firefox&Opera works except IE 11: 
				polys[i] = polygons[i].points;
				// For IE:
				//var d = polygons[i].getAttribute('points').split(' ');
				//for(var q=0; q<d.length; q++){
				//	var point = d[q].split(',')
				//	polys[i] = {x:point[0], y:point[1]};
				//}
			}
			
			var el_paths = $element[0].getElementsByTagName('path');
			var paths = [], path;

			for(var i=0; i<el_paths.length; i++){
				paths[i] = el_paths[i].pathSegList;
			}
			
			$scope.polys = polys;
			$scope.paths = paths;
			$scope.theta = 0;
			
			var animate = function(){
			
				// polygons
				// IE11 : F12 tools do not currently support extensive Scalable Vector Graphics (SVG) debugging, but several console messages are displayed to help debug SVG code.
				
				for(var i = 0; i < $scope.polys.length; i++) {
					$poly = $scope.polys[i];
					for(var q=0; q < $poly.length; q++){ // .numberOfItems
						$poly[q].y = $poly[q].y + Math.sin($scope.theta + scale($poly[q].x, 0, 500, 0, 2 * Math.PI)) * 0.5;
					}
				}
				
				// path
				for(var i = 0; i < $scope.paths.length; i++) {
					$path = $scope.paths[i];
					for(var q=0; q<$path.length; q++){
						if(configTrianglifyAnimate.pathPassSymbols.indexOf($path[q].pathSegTypeAsLetter) > -1){
							$path[q].y = $path[q].y + Math.sin($scope.theta + scale($path[q].x, 0, 500, 0, 2 * Math.PI)) * 0.5;
						}else{
							//console.log($path[q].pathSegTypeAsLetter);
						}
					}
				}	
				
				// todo: circle, rect, ellipse, line, polyline
				$scope.theta += 0.04;
			};
			$scope.animate = $interval(function(){animate()}, 10/$scope.speed, false);

		}]
};
}]);