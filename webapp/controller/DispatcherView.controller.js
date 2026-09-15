sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("dispatcherns.dispatcherproj.controller.DispatcherView", {
        onInit() {
            this.loadMasterData();
        },

        async loadMasterData() {
            const oView = this.getView();
            try {

                oView.setBusy(true);

                const [freightOrders, drivers, vehicles, assignments, vehAssignments, proposals] = await Promise.all([
                    FreightOrderService.GetBulkfo(),
                    //DriverService.GetDrv(),
                    //VehicleService.GetRes(),                  
                ]);

                //const oModel = new JSONModel(data);
                let oModel = oView.getModel();
                if (!oModel) {
                    oModel = new sap.ui.model.json.JSONModel({
                        freightOrders: [],
                        drivers: [],
                        vehicles: [],
                        assignments: [],
                        vehAssignments: [],
                        proposals: [],
                        ui: {
                            expandFO: true,
                            expandDrivers: true,
                            expandVehicles: true
                        }
                    });
                    oView.setModel(oModel);
                }
                oModel.setProperty("/freightOrders", freightOrders?.value ?? []);
                oModel.setProperty("/drivers", drivers?.value ?? []);
                oModel.setProperty("/vehicles", vehicles?.value ?? []);
                oModel.setProperty("/assignments", assignments?.value ?? []);
                oModel.setProperty("/Vehassignments", vehAssignments?.value ?? []);
                oModel.setProperty("/proposals", proposals?.value ?? []);
                //MessageBox.show(freightOrders.value.length + " Freight Orders, " + drivers.length + " Drivers, " + vehicles.length + " Vehicles, and " + assignments.length + " Assignments loaded successfully.");

                //MessageBox.show(JSON.stringify(freightOrders.value, null, 2));
                oModel.refresh(true);
                oView.setModel(oModel);

                 var Items = ['enableNowLine', 'enableAdhocLine', 'enableStatusBar'];
                this.getView().byId("gantt").getParent().setProperty('hideSettingsItem', Items);

                this._render();

            } catch (error) {
                //MessageBox.show("Unable to load Freight Orders." + (error.message || error.toString()));
            } finally {
                oView.setBusy(false);
            }
        },
        _render: function () {

            var oController = this;
            var m = oController.getView().getModel();

            if (!m) return;

            setTimeout(function () {
               
                var Items = ['enableNowLine', 'enableAdhocLine', 'enableStatusBar'];
                this.getView().byId("gantt").getParent().setProperty('hideSettingsItem', Items);

            }.bind(this), 0);

        },
        fnTimeConverter: function (sTimestamp) {
            return Format.abapTimestampToDate(sTimestamp);
        },
        onTaskAlignmentChange: function (oEvent) {
            var oSelectedKey = oEvent.getSource().getSelectedKey();
            this.byId("gantt").getTable().getRows().forEach(function (oRow) {
                oRow.getAggregation("_settings").getShapes1().forEach(function (oShape) {
                    oShape.setAlignShape(oSelectedKey);
                });
                oRow.getAggregation("_settings").getShapes2().forEach(function (oShape) {
                    oShape.setAlignShape(oSelectedKey);
                });
            });
        }
    });
});