# Directives
Set of AngularJS directives (for version 1.x)

## Instructions
These directives uses the `module.exports` for better reusability.
You will need to manually declare them as directives, like shown below

I recommend using Browserify for it.


     //declare your app
     var app = require('angular').module('asciiApp');
     
     //then declare the directive
     app.directive('inView', require('./InView'));
