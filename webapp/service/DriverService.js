sap.ui.define([
    "./ApiService"
], function (ApiService) {

    "use strict";

    return {

        getAll() {
            return ApiService.get(
                "/GetDrivers"
            );
        },
        GetDrv() {
            return ApiService.get(
                "/GetDrv"
            );
        },
        GetPosts() {
            return ApiService.get(
                ""
            );
        }      

        
    };
});