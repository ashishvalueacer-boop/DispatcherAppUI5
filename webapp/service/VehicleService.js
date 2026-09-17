sap.ui.define([
    "./ApiService"
], function (ApiService) {

    "use strict";

    return {

        getAll() {
            return ApiService.get(
                "/GetVehicles"
            );
        },
        GetRes() {
            return ApiService.get(
                "/GetRes"
            );
        }
    };
});
