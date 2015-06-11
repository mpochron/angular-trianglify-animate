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
	vectorX: 0, 
	vectorY: 1, 
	baseMax: 0, 
	baseMin: 500, 
	theta: 0.4,
	pathPassSymbols : 'MZLHmzlh' //MhvHvhvH1vhvHVLz
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

          var elements = {
            polys:      { points:[], cached: [] },
            paths:      { points:[], cached: [] },
            circles:    { points:[], cached: [] }, 
            rects:      { points:[], cached: [] },
            ellipses:   { points:[], cached: [] },
            lines:      { points:[], cached: [] },
            polylines:  { points:[], cached: [] }
          };

          // Shape <polygon>
          var polygons = $element[0].getElementsByTagName('polygon');			
          for(var i=0; i<polygons.length; i++) elements.polys.points.push(polygons[i].points);

          // Shape <path>
          var el_paths = $element[0].getElementsByTagName('path');
          for(var i=0; i<el_paths.length; i++) elements.paths.points.push(el_paths[i].pathSegList);

          // Shape <circle>
          var el_circle = $element[0].getElementsByTagName('circle');
          for(var i=0; i<el_circle.length; i++) elements.circles.points.push({'x':el_circle[i].cx,'y':el_circle[i].cy,'r':el_circle[i].r});

          // Shape <rect> 
          var el_rect = $element[0].getElementsByTagName('rect');
          for(var i=0; i<el_rect.length; i++) elements.rects.points.push({x:el_rect[i].x, y:el_rect[i].y, width:el_rect[i].width, height:el_rect[i].height}); 

          // Shape <ellipse>
          var el_ellipse = $element[0].getElementsByTagName('ellipse');
          for(var i=0; i<el_ellipse.length; i++) elements.ellipses.points.push({'x':el_ellipse[i].rx, 'y':el_ellipse[i].ry}); 

          // Shape <line> 
          var el_line = $element[0].getElementsByTagName('line');
          for(var i=0; i<el_line.length; i++) elements.lines.points.push({'x1':el_line[i].x1, 'y1':el_line[i].y1, 'x2':el_line[i].x2, 'y2':el_line[i].y2}); 

          // Shape <polyline>
          var el_polyline = $element[0].getElementsByTagName('polyline');
          for(var i=0; i<el_polyline.length; i++) elements.polylines.points.push(el_polyline[i].points);

          // Copy values
          for(var element in elements){
            var p = elements[element].points;
            for(var i=0; i<p.length; i++){
              switch(element){
                case 'line': //x1,x2,y1,y2
                  elements[element].cached.push({x1: p[i].x1, x2: p[i].x2, y1: p[i].y1, y2:p[i].y2 });
                  break;
                case 'polys':
                  elements[element].cached[i] = [];
                  var $path;
                  for(var q=0, $path = p[i], $item; q < $path.numberOfItems; q++){
                    $item= $path.getItem(q);
                    var w = {};
                    w['x'] = $item.x;
                    w['y'] = $item.y;
                    elements[element].cached[i].push(w);
                  }
                  break;
                case 'paths':
                  elements[element].cached[i] = [];
                  for(var q=0, $path = p[i], $item; q < $path.numberOfItems; q++)
                    if(configTrianglifyAnimate.pathPassSymbols.indexOf(($item = $path.getItem(q)).pathSegTypeAsLetter) > -1)
                      elements[element].cached[i].push({x: $item.x, y: $item.y});     
                    else elements[element].cached[i].push(null);
                  break;
                default:
                  elements[element].cached.push({x: p[i].x ,y: p[i].y});
              }
            }
          }
          
          $scope.elements = elements;

          if(!window.hasOwnProperty('f')) window.f = [];
          
          f.push(elements);
          
          //angular.extend($scope, {'polys':polys, 'paths':paths, 'circles':circles, 'rects':rects, 'ellipses':ellipses, 'lines':lines, 'polylines':polylines});
          $scope.theta = 0;

          var calculate = function(l1, l2, theta, points){
            // polygons
            // Problem IE11 : F12 tools do not currently support extensive Scalable Vector Graphics (SVG) debugging, but several console messages are displayed to help debug SVG code.

            // Shape <polygon>
            for(var i = 0, temp, $poly; i < $scope.elements.polys.points.length; i++) {
                for(var q=0, $poly = $scope.elements.polys.points[i], $item; q < $poly.numberOfItems; q++){
                  temp = $poly.getItem(q);
                  temp[l1] += Math.sin($scope.theta + scale($scope.elements.polys.cached[i][q][l2], 0, 500, 0, 2 * Math.PI)) * 0.5;
                }
            }
            // Shape <path>
            for(var i = 0, $path; i < $scope.elements.paths.points.length; i++) {
              for(var q = 0, $path = $scope.elements.paths.points[i], $item; q < $path.numberOfItems; q++)
                if(configTrianglifyAnimate.pathPassSymbols.indexOf(($item = $path.getItem(q)).pathSegTypeAsLetter) > -1){
                  if($scope.elements.paths.cached[i][q]){
                    if($scope.elements.paths.cached[i][q].hasOwnProperty(l2) && $item[l1] && !isNaN($item[l1]) && !isNaN($scope.elements.paths.cached[i][q][l2]))
                      $item[l1] += Math.sin($scope.theta + scale($scope.elements.paths.cached[i][q][l2], 0, 500, 0, 2 * Math.PI)) * 0.5;
                    else if($item[l1] && !isNaN($item[l1]))
                      $item[l1] += Math.sin($scope.theta + scale($scope.elements.paths.cached[i][q][l1], 0, 500, 0, 2 * Math.PI)) * 0.5;
                  }
              }
                  //$item[l1] += Math.sin($scope.theta + scale($item[l2], 0, 500, 0, 2 * Math.PI)) * 0.5;
            }
            // Shape <circle>
            for(var i = 0, $circle; i < $scope.elements.circles.points.length; i++) { 
              ($circle = $scope.elements.circles.points[i])[l1] += Math.sin($scope.theta + scale($scope.elements.circles.cached[i][l2], 0, 500, 0, 2 * Math.PI)) * 0.5;
            }
            // Shape <rect>
            for(var i = 0, $rect; i < $scope.elements.rects.points.length; i++) {
              ($rect = $scope.elements.rects.points[i])[l1] += Math.sin($scope.theta + scale($scope.elements.rects.cached[i][l2], 0, 500, 0, 2 * Math.PI)) * 0.5;
            }
            // Shape <ellipse>
            for(var i = 0, $ellipse; i < $scope.elements.ellipses.points.length; i++) {
              ($ellipse = $scope.elements.ellipses.points[i])[l1] += Math.sin($scope.theta + scale($scope.elements.ellipses.cached[i][l2], 0, 500, 0, 2 * Math.PI)) * 0.5;
            }
            // Shape <line>
            for(var i = 0, $line; i < $scope.elements.lines.points.length; i++) {
              ($line = $scope.elements.lines.points[i])[points[0]] += + Math.sin($scope.theta + scale($scope.elements.lines.cached[i][points[2]], 0, 500, 0, 2 * Math.PI)) * 0.5;
              $line[points[1]] += Math.sin($scope.theta + scale($scope.elements.lines.cached[i][points[3]], 0, 500, 0, 2 * Math.PI)) * 0.5;
            }

            // Shape <polyline>
            for(var i = 0, $polyline; i < $scope.elements.polylines.points.length; i++) {
              for(var q=0, $polyline = $scope.elements.polylines.points[i], $item; q < $polyline.numberOfItems; q++)
                ($item=$polyline.getItem(q))[l1] += Math.sin($scope.theta + scale($item[l2], 0, 500, 0, 2 * Math.PI)) * 0.5;
            }
          };


          var animate = function(){

            if($scope.vectorY > 0 && $scope.vectorX == 0) calculate('y', 'x', $scope.theta, ['y1','y2','x1','x2']);
            else if($scope.vectorX > 0 && $scope.vectorY == 0) calculate('x', 'y', $scope.theta, ['x1','x2','y1','y2']);
            else{
              calculate('y', 'y', $scope.theta, ['y1','y2','y1','y2']);
              calculate('x', 'x', $scope.theta, ['x1','x2','x1','x2']);
            }
            
            $scope.theta += 0.04;
          };
          $scope.animate = $interval(function(){animate()}, 10/$scope.speed, false);

      }]
};
}]);