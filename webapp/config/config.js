sap.ui.define([], function () {
    "use strict";


    const LOCAL_BASE_URL = "http://localhost:4004";
    const DEV_BASE_URL = "https://7a89bf9atrial-dev-dispatcherservice-srv.cfapps.us10-001.hana.ondemand.com";
    const PROD_DISPATCH_BASE_URL = "https://valueacer-solutions-private-limited-valueacer-dev-d92qq34ae1309.cfapps.eu10-005.hana.ondemand.com";


    // const sEnv = this.getOwnerComponent()
    //     .getManifestEntry("/sap.ui5/config/environment");


    const CONFIG = {
        LOCAL: LOCAL_BASE_URL + "/odata/v4/dispatcher",
        DEV: DEV_BASE_URL + "/odata/v4/dispatcher",
        PROD: PROD_DISPATCH_BASE_URL + "/odata/v4/dispatcher"
    };

    return CONFIG;
});