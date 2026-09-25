sap.ui.define([
    "sap/ui/core/UIComponent",
    "./model/models",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/resource/ResourceModel",
    "./localService/mockserver",
    "./service/FreightOrderService",
    "./service/DriverService",
    "./service/VehicleService",
], (UIComponent, models, JSONModel, ODataModel, ResourceModel, mockserver, FreightOrderService, DriverService, VehicleService) => {
    "use strict";

    return UIComponent.extend("dispatcherns.dispatcherproj.Component", {
        metadata: {
            rootView: {
                "id": "RootView",
                "viewName": "dispatcherns.dispatcherproj.App",
                "type": "XML",
                "async": true
            },
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]


        },

        init() {
            // call the base component's init function

            // this._adjustTableWidth();
            // window.addEventListener("resize", this._adjustTableWidth.bind(this));

            UIComponent.prototype.init.apply(this, arguments);


            const oDataModel = new sap.ui.model.json.JSONModel({
                Requirements: [],
                Drivers: [],
                Resources: [],
                ui: {
                    expandFO: true,
                    expandDrivers: true,
                    expandVehicles: true
                }
            });

            this.setModel(oDataModel, "data");

            this.loadMasterData();


            this.setModel(
                new ResourceModel({
                    bundleName: "dispatcherns.dispatcherproj.i18n.i18n"
                }), "i18n"
            );


            var oCalJSONModel = new JSONModel();
            oCalJSONModel.loadData(sap.ui.require.toUrl("dispatcherns/dispatcherproj/localService/mockdata/Calendars.json"));
            this.setModel(oCalJSONModel, "calc");

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        },
        exit: function () {
            this._oMockServer.stop();
            this._oMockServer.destroy();
        },

        async loadMasterData(oFromDate, oToDate, oDc) {
            try {

                var sFromDate =
                    oFromDate.getFullYear() + "-" +
                    String(oFromDate.getMonth() + 1).padStart(2, "0") + "-" +
                    String(oFromDate.getDate()).padStart(2, "0");

                var sToDate =
                    oToDate.getFullYear() + "-" +
                    String(oToDate.getMonth() + 1).padStart(2, "0") + "-" +
                    String(oToDate.getDate()).padStart(2, "0");

                const sStartTime = sFromDate + "T00:00:00Z";
                const sEndTime = sToDate + "T23:59:59Z";
                const sDC = oDc;

                const [
                    _requirements,
                    _drivers,
                    _resources
                ] = await Promise.all([

                    FreightOrderService.GetBulkfo({
                        p_start_time: sStartTime,
                        p_end_time: sEndTime,
                        p_dc: sDC
                    }),
                    DriverService.GetDrv({
                        p_start_time: sStartTime,
                        p_end_time: sEndTime,
                        p_dc: sDC
                    }),
                    VehicleService.GetRes({
                        p_start_time: sStartTime,
                        p_end_time: sEndTime,
                        p_dc: sDC
                    })

                ]);

                var aShapes = [];

                var aResources = Array.isArray(_resources) ? _resources : (_resources?.value || []);

                aResources.forEach(function (oResource) {
                    oResource.AvailabilityShapes = [];

                    (oResource.availability || []).forEach(function (oAvail, i) {
                        oResource.AvailabilityShapes.push({
                            resourceId: oResource.resourceId,
                            StartTime: new Date(oAvail.startTime).toISOString().replace(".000", ""),
                            EndTime: new Date(oAvail.endTime).toISOString().replace(".000", ""),
                            description: oResource.description
                        })
                    });

                });      

                var aRequirements =  Array.isArray(_requirements) ? _requirements : (_requirements?.value || []);
                aResources.forEach(function (oTruck) {
                    oTruck.FOShapes = aRequirements
                        .filter(function (oFO) {
                            return oFO.Veh_id === oTruck.resourceId;
                        })
                        .map(function (oFO) {
                            return {
                                shapeId: oFO.id,
                                Title: oFO.id,
                                StartTime: oFO.Departure_Time,
                                EndTime: oFO.Arrival_Time
                            };

                        });
                });



                this.setModel(
                    new JSONModel({
                        Requirements: _requirements?.value || [],
                        Drivers: _drivers?.value || [],
                        Resources: aResources,
                        AvailabilityShapes: aShapes
                    }),
                    "data"
                );

            } catch (error) {
                sap.m.MessageBox.error(
                    "Unable to load data: " +
                    (error.message || error.toString())
                );
            }
        }




    });
});