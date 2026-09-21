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
        GetFOSimilution(oPayload) {

            const query = new URLSearchParams({
             IvTorKey: oPayload.IvTorKey,
             IvNewDepartureDatetime: oPayload.IvNewDepartureDatetime             
            }).toString();

            // const query =
            //     `&IvTorKey=${encodeURIComponent(oPayload.IvTorKey)}` +
            //     `IvNewDepartureDatetime=${encodeURIComponent(oPayload.IvNewDepartureDatetime)}`;

            return ApiService.get(`/GetFOSimilution?${query}`);
        },
        GetFOSimilutionV1() {

            return ApiService.get(
                "/GetFOSimilutionV1"
            );
        },
        GetFOSimilutionV2() {

            return ApiService.get(
                "/GetFOSimilutionV2"
            );
        },
        GetBulkfo: function (oPayload) {

            const query = new URLSearchParams({
                p_start_time: oPayload.p_start_time,
                p_end_time: oPayload.p_end_time
            }).toString();

            return ApiService.get(
                `/GetBulkfo?${query}`
            );
        }
        
    };
});