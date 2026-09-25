sap.ui.define([
    "./ApiService"
], function (ApiService) {

    "use strict";

    return {

        getAll() {
            return ApiService.get(
                "/assignments"
            );
        },

        create(payload) {
            return ApiService.post(
                "/assignments",
                payload
            );
        },

        delete(id) {
            return ApiService.delete(
                `/assignments/${id}`
            );
        },
        getAllVehAssignments() {
            return ApiService.get(
                "/VehicleAssignments"
            );
        },
        
    };
});