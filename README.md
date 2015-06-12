# angular-trianglify-animate
### Angular Trianglify Animate is tiny (2kb) plugin to add support for animate images SVG to your page.

## Dependencies
+ Angular.js (1.2+)

## Usage
### Setup & Initialise the plugin

Include the trianglify-animate JS after the angular.js
```html
<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.8/angular.min.js" type="text/javascript"></script>
<script src="//machei.github.io/angular-trianglify-animate/trianglify.animate.js" type="text/javascript"></script>
```

1#Way: The ng-app directive initializes a module 'moduleTrianglifyAnimate' as the main module of an Angular application to your application: 

```html
<body ng-app="moduleTrianglifyAnimate">
```
2#Way: Add the Trianglify Animate module as a dependency to your application module:
```js
angular.module('yourApp', ['moduleTrianglifyAnimate'])
```

Using the plugin with the attribue of element svg works in a similar way. 

#### Using with element SVG
```html
<svg id="svg_example" ng-trianglify-animate></svg>;
```

#### Using with images SVG
```html
<img id="svg_example" src="../image.svg" ng-trianglify-animate />
```
## Options

### Default Options

The following are the default options set by the plugin Angular Trianglify Animate:

Option | Default Value | Type | Description
--- | --- | --- | ---
speed | 1 | number | Animation speed
easing | 'linear' | string | Easing animation tool (soon this feature will be added)
vector-x | 0 | number | Vector space X
vector-y | 5 | number | Vector space Y
base-max | 0 | number | soon
base-min | 500 | number | soon
thesa | 0.4 | number | Polar angle (pi)

## Todolist

+ add support for easing animation
+ add more effects: shake and more ..


## License
Released under the [MIT license](http://www.opensource.org/licenses/MIT).
