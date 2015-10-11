These directives uses the `module.exports` for better reusability.
You will need to manually declare them as directives, like shown below
You can use Browserify for it.


     //declare your app
     var app = require('angular').module('asciiApp');
     
     //then declare the directive
     app.directive('inView', require('./InView'));
