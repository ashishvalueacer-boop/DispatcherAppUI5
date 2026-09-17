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

        async loadMasterData() {
            try {

                const [
                    _requirements,
                    _drivers,
                    _resources
                ] = await Promise.all([
                    FreightOrderService.GetBulkfo(),
                    DriverService.GetDrv(),
                    VehicleService.GetRes()
                ]);              

                
                this.setModel(
                    new JSONModel({
                        Requirements: _requirements?.value || [],
                        Drivers: _drivers?.value || [],
                        Resources: _resources?.value || []
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