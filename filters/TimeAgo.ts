var moment: moment.MomentStatic = require('moment');

//In angular filter is function which returns a function.
//So it needs to defined like this.
function getFilter() {
    return function TimeAgoFilter(date: Date, args: Array<any>): string {
        /// <summary>
        /// Light wrapper around moment.js library.
        /// Converts dates to human readable format such as "3 days ago".
        /// If date is older that 'translateDateAfter' then it only formats the date according to 'dateFormat'
        /// 
        /// Example usage:
        /// <span class="date" ng-bind="::product.date | timeAgo:[dateLimit, 'DD.MM.YYYY']"></span>
        /// </summary>

        var translateDateAfter : Date = args[0],
            dateFormat: string  = args[1],
            result : string = null;

        if (date < translateDateAfter) {
            result = moment(date).format(dateFormat);
        }
        else {
            result = moment(date).fromNow()
        }

        return result;
    }
}


module.exports = getFilter;
