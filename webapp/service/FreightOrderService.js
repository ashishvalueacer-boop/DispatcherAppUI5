sap.ui.define([
    "./ApiService"
], function (ApiService) {

    "use strict";

    return {

        GetFreightOrders() {
            return ApiService.get(
                "/GetFreightOrders"
            );
        },
        GetInitialData() {
            return ApiService.get(
                "/GetInitialData"
            );
        },

        getById(id) {
            return ApiService.get(
                `/GetFreightOrders/${id}`
            );
        },
        GetBulkfo:function(filters ={}){
            const query = new URLSearchParams(filters).toString();

            return ApiService.get(
                `/GetBulkfo?${query}`
            );
        }
    };
});