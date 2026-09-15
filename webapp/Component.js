sap.ui.define([
    "sap/ui/core/UIComponent",
    "./model/models",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/resource/ResourceModel",
    "./localService/mockserver"
    

], (UIComponent, models, JSONModel, ODataModel, ResourceModel, mockserver) => {
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
            // dependencies: {
			// 	libs: [
			// 		"sap.gantt",
			// 		"sap.ui.table",
			// 		"sap.m"
			// 	]
			// },
            // config: {
			// 	sample: {
			// 		stretch: true,
			// 		files: [
			// 			"i18n/i18n.properties",
			// 			"localService/mockserver.js",
			// 			"localService/metadata.xml",
			// 			"localService/mockdata/Calendars.json",
			// 			"localService/mockdata/Requirements.json",
			// 			"localService/mockdata/Resources.json",
			// 			"localService/mockdata/UtilizationItems.json",
			// 			"localService/mockdata/Utilizations.json",
			// 			"model/formatter.js",
			// 			"view/AxisTimeStrategy.fragment.xml",
			// 			"view/DetailPopover.fragment.xml",
			// 			"view/FreightOrder.fragment.xml",
			// 			"view/FreightOrderAndFreightUnit.fragment.xml",
			// 			"view/FreightUnit.fragment.xml",
			// 			"view/OrderCreate.fragment.xml",
			// 			"view/Requirement.fragment.xml",
			// 			"view/SharedTableColumn.fragment.xml",
			// 			"view/Truck.fragment.xml",
			// 			"Component.js",
			// 			"GanttChartContainer.controller.js",
			// 			"GanttChartContainer.view.xml",
			// 			"UtilizationGroup.js"
			// 		]
			// 	}
			// },
           
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
               
            var sODataServiceUrl = "dispatcherns.dispatcherproj/";

            // init our mock server
			this._oMockServer = mockserver.init(sODataServiceUrl);

            // set model on component
			this.setModel(
				new ODataModel(sODataServiceUrl, {
					json : true,
					useBatch : true
				}), "data"
			);           
            
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
		}
    });
});