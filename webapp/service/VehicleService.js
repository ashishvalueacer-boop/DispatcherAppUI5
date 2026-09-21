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
        },
         GetRes(oPayload) {            
            const query = new URLSearchParams({
                p_start_time: oPayload.p_start_time,
                p_end_time: oPayload.p_end_time,
                p_dc :  oPayload.p_dc
            }).toString();

            return ApiService.get(
                `/GetRes?${query}`
            );
        }
    };
});
