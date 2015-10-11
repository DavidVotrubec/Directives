var angular = require('angular');

function InView($compile: ng.ICompileService, $window: ng.IWindowService, $timeout: ng.ITimeoutService) {
    /// <summary>
    /// This directive checks whether current element is in viewport.
    /// If yes, then it calls function defined in the in-view-action attribute.
    /// Ideal candidate for infinite scrolling.
    /// Example: 
    /// 
    /// <product-item ng-if="main.products.length > 0" ng-repeat="p in main.products" product="p"></product-item>
    ///     
    /// <div ng-if="main.isLoading">
    ///     <h3>is loading ...</h3>
    ///  </div>
    /// 
    ///  <in-view in-view-action="main.loadMore" style="min-height: 1px; min-height: 1px;"></in-view>
    /// </summary>

    var definition: ng.IDirective = {
        restrict: 'AE',
        scope: {
            //action to perform when this element becomes visible
            inViewAction: '=', //mandatory

            //listen on event. When event of this name is captured, it will recheck if element is in viewport
            triggerOnEvent: '=' //optional
        },
        link: (scope: any, element: JQuery, attrs) => {

            if (attrs.inViewAction == undefined) {
                console.error('InView - missing action');
                return;
            }
            
            //Sanity check.
            //Element should be visible if not, then it means that this directive is disabled 
            var style = $window.getComputedStyle(element[0]);
            if (style.display == 'none') {
                return;
            }
            
            var throttledCheck = throttle(check, 250, null);
            angular.element($window).bind("scroll", throttledCheck);
            angular.element($window).bind("resize", throttledCheck);

            //If triggerOnEvent is defined, then listen for this event and re-check
            if (scope.triggerOnEvent != undefined && scope.triggerOnEvent != '' && angular.isString(scope.triggerOnEvent)) {
                scope.$on(scope.triggerOnEvent, check);
            }
            
            function check() {
                /// <summary>
                /// Check if element is in view
                /// </summary>
                
                var rect = element[0].getBoundingClientRect();

                var isInView = 
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth);

                if (isInView) {
                    scope.inViewAction();
                }
            }

            //on init
            $timeout(check, 500);
        }
    }
    

    //Copied from underscore.js - https://github.com/jashkenas/underscore/blob/master/underscore.js
    //I've only replaced the call to '_.now' function with new Date().getTime()
    //
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    function throttle(func, wait, options) {
        
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function () {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        
        return function () {
            var now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };


    return definition;
}

module.exports = InView;
