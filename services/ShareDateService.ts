module STAngular {

    export interface IShareDataService {
        getData(key: string): any;
        setData(key: string, data: any): void;
    }

    Module.factory("ShareDataService", [(): STAngular.IShareDataService => {
		/// <summary>	
		/// super simple service for sharing data between controllers
        /// </summary>	

        var data = {};

        function getData(key) {
            return data[key]
        }

        function setData(key, obj) {
            data[key] = obj;
        }

        return {
			getData: getData,
			setData: setData
        };
    }]);

} 
