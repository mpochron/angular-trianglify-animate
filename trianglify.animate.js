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

			//** Init Shapes **//

			
			// Chrome&Firefox&Opera works except IE 11: 

			// For IE:
			//var d = polygons[i].getAttribute('points').split(' ');
			//for(var q=0; q<d.length; q++){
			//	var point = d[q].split(',')
			//	polys[i] = {x:point[0], y:point[1]};
			//}
			
			// Shape <polygon>
			var polygons = $element[0].getElementsByTagName('polygon');			
			for(var i=0, polys=[]; i<polygons.length; i++) polys[i] = polygons[i].points;
			
			// Shape <path>
			var el_paths = $element[0].getElementsByTagName('path');
			for(var i=0, paths=[]; i<el_paths.length; i++) paths[i] = el_paths[i].pathSegList;
		
			// Shape <circle>
			var el_circle = $element[0].getElementsByTagName('circle');
			for(var i=0, circles=[]; i<el_circle.length; i++) circles[i] = {'x':el_circle[i].cx,'y':el_circle[i].cy,'r':el_circle[i].r};

			// Shape <rect> 
			var el_rect = $element[0].getElementsByTagName('rect');
			for(var i=0, rects=[]; i<el_rect.length; i++) rects[i] = {'x':el_rect[i].x, 'y':el_rect[i].y, 'width':el_rect[i].width, 'height':el_rect[i].height};
			
			// Shape <ellipse>
			var el_ellipse = $element[0].getElementsByTagName('ellipse');
			for(var i=0, ellipses=[]; i<el_ellipse.length; i++) ellipses[i] = {'x':el_ellipse[i].rx, 'y':el_ellipse[i].ry};

			// Shape <line> 
			var el_line = $element[0].getElementsByTagName('line');
			for(var i=0, lines=[]; i<el_line.length; i++) lines[i] = {'x1':el_line[i].x1, 'y1':el_line[i].y1, 'x2':el_line[i].x2, 'y2':el_line[i].y2};
			
			// Shape <polyline>
			var el_polyline = $element[0].getElementsByTagName('polyline');
			for(var i=0, polylines=[]; i<el_polyline.length; i++) polylines[i] = el_polyline[i].points;
						
			angular.extend($scope, {'polys':polys, 'paths':paths, 'circles':circles, 'rects':rects, 'ellipses':ellipses, 'lines':lines, 'polylines':polylines});
			$scope.theta = 0;
			
			var animate = function(){

				// polygons
				// Problem IE11 : F12 tools do not currently support extensive Scalable Vector Graphics (SVG) debugging, but several console messages are displayed to help debug SVG code.
				
				// Shape <polygon>
				for(var i = 0, $poly; i < $scope.polys.length; i++) 
					for(var q=0, $poly = $scope.polys[i], $item; q < $poly.numberOfItems; q++)
						($item=$poly.getItem(q)).y = $item.y + Math.sin($scope.theta + scale($item.x, 0, 500, 0, 2 * Math.PI)) * 0.5;
				
				// Shape <path>
				for(var i = 0, $path; i < $scope.paths.length; i++)
					for(var q=0, $path = $scope.paths[i], $item; q<$path.numberOfItems; q++)
						if(configTrianglifyAnimate.pathPassSymbols.indexOf(($item = $path.getItem(q)).pathSegTypeAsLetter) > -1)
							$item.y = $item.y + Math.sin($scope.theta + scale($item.x, 0, 500, 0, 2 * Math.PI)) * 0.5;
				
				// Shape <circle>
				for(var i = 0, $circle; i < $scope.circles.length; i++) 
					($circle = $scope.circles[i]).y = $circle.y + Math.sin($scope.theta + scale($circle.x, 0, 500, 0, 2 * Math.PI)) * 0.5;
				
				// Shape <rect>
				for(var i = 0, $rect; i < $scope.rects.length; i++) 
					($rect = $scope.rects[i]).y = $rect.y + Math.sin($scope.theta + scale($rect.x, 0, 500, 0, 2 * Math.PI)) * 0.5;
				
				// Shape <ellipse>
				for(var i = 0, $ellipse; i < $scope.ellipses.length; i++) 
					($ellipse = $scope.ellipses[i]).y = $ellipse.y + Math.sin($scope.theta + scale($ellipse.x, 0, 500, 0, 2 * Math.PI)) * 0.5;
					
				// Shape <line>
				for(var i = 0, $line; i < $scope.lines.length; i++) {
					($line = $scope.lines[i]).y1 = $line.y1 + Math.sin($scope.theta + scale($line.x1, 0, 500, 0, 2 * Math.PI)) * 0.5;
					$line.y2 = $line.y2 + Math.sin($scope.theta + scale($line.x2, 0, 500, 0, 2 * Math.PI)) * 0.5;
				}
					
				// Shape <polyline>
				for(var i = 0, $polyline; i < $scope.polylines.length; i++) 
					for(var q=0, $polyline = $scope.polylines[i], $item; q < $polyline.numberOfItems; q++)
						($item=$polyline.getItem(q)).y = $item.y + Math.sin($scope.theta + scale($item.x, 0, 500, 0, 2 * Math.PI)) * 0.5;
				
				$scope.theta += 0.04;
			};
			$scope.animate = $interval(function(){animate()}, 10/$scope.speed, false);

		}]
};
}]);