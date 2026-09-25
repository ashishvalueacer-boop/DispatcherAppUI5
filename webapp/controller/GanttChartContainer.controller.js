sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../localService/mockserver",
	"../model/formatter",
	"sap/gantt/misc/Utility",
	"sap/ui/core/Fragment",
	"../service/FreightOrderService",
], function (Controller, JSONModel, mockserver, formatter, Utility, Fragment, FreightOrderService) {
	"use strict";


	return Controller.extend("dispatcherns.dispatcherproj.controller.GanttChartContainer", {

		formatter: formatter,

		onInit: function () {

			var oDataModel = this.getOwnerComponent().getModel("data");

			var oToday = new Date();
			var oFirstDay = new Date(
				oToday.getFullYear(),
				oToday.getMonth(),
				1
			);

			var oFromDate = new Date(oToday);
			oFromDate.setDate(oFromDate.getDate() - 7);

			var oToDate = new Date(oToday);
			oToDate.setDate(oToDate.getDate() + 7);

			this.byId("dpFromDate").setDateValue(oFromDate);
			this.byId("dpToDate").setDateValue(oToDate);

			//console.log(oDataModel.getProperty("/Requirements"));
			// var aDeferredGroups = oDataModel.getDeferredGroups();
			// aDeferredGroups = aDeferredGroups.concat(["deferred"]);
			// oDataModel.setDeferredGroups(aDeferredGroups);

			var m = this.getOwnerComponent().getModel("data");
			if (!m) return;

			var oToday = new Date();

			// // First day of current month
			// var oStart = new Date(
			// 	oToday.getFullYear(),
			// 	oToday.getMonth(),
			// 	1
			// );

			// // Last day of current month
			// var oEnd = new Date(
			// 	oToday.getFullYear(),
			// 	oToday.getMonth() + 1,
			// 	0
			// );

			// var formatGanttDate = function (oDate) {
			// 	return oDate.getFullYear() +
			// 		String(oDate.getMonth()).padStart(2, "0") +
			// 		String(oDate.getDate()).padStart(2, "0") +
			// 		"000000";
			// };

			// var oViewModel = new sap.ui.model.json.JSONModel({
			// 	horizonStart: formatGanttDate(oStart),
			// 	horizonEnd: formatGanttDate(oEnd)
			// });

			// this.getView().setModel(oViewModel, "horizon");

			this.iNewFOCount = 0;
			var oGantt1 = this.getView().byId("FreightOrder");

			var oFullScreenButton1 = new sap.m.Button({
				icon: "sap-icon://full-screen",
				type: "Transparent",
				press: function () {
					this.onToggleFullScreen(oGantt1, false, oFullScreenButton1);
				}.bind(this)
			});
			oGantt1.addEventDelegate({
				onAfterRendering: function () {

					var oGanttOverflowToolbar = oGantt1.getChartOverflowToolbar();
					if (oGanttOverflowToolbar) {
						oGanttOverflowToolbar.addContent(oFullScreenButton1);
					}
					//oGantt1.setShowBirdEye(true);
				}
			});
			this.onLoadData();
			/********************************************************************************************* */
			var oGantt2 = this.getView().byId("Truck");
			var oFullScreenButton2 = new sap.m.Button({
				icon: "sap-icon://full-screen",
				type: "Transparent",
				press: function () {
					this.onToggleFullScreen(oGantt2, true, oFullScreenButton2);
				}.bind(this)
			});
			oGantt2.addEventDelegate({
				onAfterRendering: function () {
					var oGanttOverflowToolbar = oGantt2.getChartOverflowToolbar();
					if (oGanttOverflowToolbar) {
						oGanttOverflowToolbar.addContent(oFullScreenButton2);
					}
				}
			});

			//this.getView().getModel("data").setProperty("/aShapes", aShapes);
			/********************************************************************************************* */
			// var oGantt3 = this.getView().byId("Driver");
			// var oFullScreenButton3 = new sap.m.Button({
			// 	icon: "sap-icon://full-screen",
			// 	type: "Transparent",
			// 	press: function () {
			// 		this.onToggleFullScreen(oGantt3, true, oFullScreenButton3);
			// 	}.bind(this)
			// });
			// oGantt3.addEventDelegate({
			// 	onAfterRendering: function () {
			// 		var oGanttOverflowToolbar = oGantt3.getChartOverflowToolbar();
			// 		if (oGanttOverflowToolbar) {
			// 			oGanttOverflowToolbar.addContent(oFullScreenButton3);
			// 		}
			// 	}
			// });
		},
		/********************************************************************************************** */
		onToggleFullScreen: function (oGantt, bShowToolbar, oButton) {
			oGantt.toggleFullScreen(bShowToolbar, oButton);
			if (oGantt.fullScreenMode()) {
				oButton.setIcon("sap-icon://exit-full-screen");
				//this.getView().byId("layoutSelect").setVisible(false);
			} else {
				oButton.setIcon("sap-icon://full-screen");
				//this.getView().byId("layoutSelect").setVisible(true);
			}
		},

		onLoadData: async function () {

			var oFromDate = this.byId("dpFromDate").getDateValue();
			var oToDate = this.byId("dpToDate").getDateValue();
			var oDc = this.byId("ownerSelect").getSelectedKey();

			if (!oFromDate || !oToDate) {
				sap.m.MessageToast.show("Please select From Date and To Date");
				return;
			}

			// await this.getOwnerComponent().loadMasterData(
			// 	oFromDate,
			// 	oToDate,
			// 	oDc
			// );
		},
		onFilter: function () {
			this.applyFilters();

		},

		applyFilters: function () {

			const oView = this.getView();
			const oFilterData = {
				fromDateTime: oView.byId("dpFromDate").getDateValue(),
				toDateTime: oView.byId("dpToDate").getDateValue()
			};

			this.onLoadData();

		},

		onShapeDrop: async function (oEvent) {

			try {


				var oSourceGantt = oEvent.getSource();
				//var oNewDateTime = oEvent.getParameter("newDateTime");
				var oDraggedShapeDates = oEvent.getParameter("draggedShapeDates");
				var sLastDraggedShapeUid = oEvent.getParameter("lastDraggedShapeUid");


				var oParsedUid = Utility.parseUid(sLastDraggedShapeUid).shapeId;
				oParsedUid = oParsedUid.replace(/-/g, "").toUpperCase();
				var oNewDateTime_s = oEvent.getParameter("newDateTime");

				var NewDepartureDatetime = formatter.formatDate(oNewDateTime_s);
				//var sPath = oParsedUid.shapeDataName;


				const response = await FreightOrderService.GetFOSimilution({
					IvTorKey: oParsedUid,
					IvNewDepartureDatetime: NewDepartureDatetime //'20260922044441'
				});

				// console.log("API Response", response);
				const oSimulation = response?.value?.[0]?.simulationResults || [];

				if (!oSimulation) {
					sap.m.MessageToast.show("No simulation result returned");
					return;
				}
				else if (oSimulation[0].updateRc === 'F') {
					sap.m.MessageToast.show("Simiulation Result is Failed ......");
					return;
				}


				if (oSimulation[0].updateRc != 'F') {

					// console.log("Simulation Results", aResults);

					// const sNewDepartureStart = response?.value?.[0]?.simulationResults?.[0]?.newDepartureStart;
					// const sNewDepartureEnd = response?.value?.[0]?.simulationResults?.[0]?.newDepartureEnd;
					// const aRestBreaks = response?.value?.[0]?.simulationResults?.[0]?.restBreaks || [];

					const {
						newDepartureStart,
						newDepartureEnd,
						restBreaks
					} = response.value[0].simulationResults[0];

					// console.log(newDepartureStart);
					// console.log(newDepartureEnd);
					// console.log(restBreaks);


					// Convert API datetime string to JS Date
					const oNewDateTime = formatter.dateToNewObject(newDepartureStart);
					const oNewEndDateTime = formatter.dateToNewObject(newDepartureEnd);

					var oOldStartDateTime = oDraggedShapeDates[sLastDraggedShapeUid].time;
					var oOldEndDateTime = oDraggedShapeDates[sLastDraggedShapeUid].endTime;
					var iMoveWidthInMs = oNewDateTime.getTime() - oOldStartDateTime.getTime();
					if (oSourceGantt.getGhostAlignment() === sap.gantt.dragdrop.GhostAlignment.End) {
						iMoveWidthInMs = oNewDateTime.getTime() - oOldEndDateTime.getTime();
					}

					// const sFO = oShapeData.shape.getShapeId();
					// const dStart = oShapeData.time;
					// const dEnd = oShapeData.endTime;

					var getBindingContextPath = function (sShapeUid) {
						var oParsedUid = Utility.parseUid(sShapeUid);
						return oParsedUid.shapeDataName;
					};

					var oTargetRow = oEvent.getParameter("targetRow");
					var oTargetObject = oTargetRow.getBindingContext("data").getObject();
					var sTargetObjectType = oTargetObject.resourceType;

					var oDataModel = this.getOwnerComponent().getModel("data");
					var oDataModel = oSourceGantt.getModel("data");
					var that = this;

					Object.keys(oDraggedShapeDates).forEach(function (sShapeUid) {
						var sPath = getBindingContextPath(sShapeUid);
						// var oOldDateTime = oDraggedShapeDates[sShapeUid].time;
						// var oOldEndDateTime = oDraggedShapeDates[sShapeUid].endTime;
						var oNewDateTime = new Date(formatter.dateToNewObject(newDepartureStart).getTime() + iMoveWidthInMs);
						var oNewEndDateTime = new Date(formatter.dateToNewObject(newDepartureEnd).getTime() + iMoveWidthInMs);

						var oData = oDataModel.getObject(sPath);

						var sType = oDataModel.getProperty(sPath + "/Type");

						if (sTargetObjectType == "09") {
							if (sType == "FO") {
								that.handleMoveFreightOrderToTruck(oNewDateTime.toISOString().replace(".000", ""), oNewEndDateTime.toISOString().replace(".000", ""), oTargetObject, sPath, oDataModel, iMoveWidthInMs);
							} else if (sType == "FU") {
								if (oData.PlanStatus == "unplanned") {
									that.handleMoveFreightUnitToTruck(oNewDateTime.toISOString().replace(".000", ""), oNewEndDateTime.toISOString().replace(".000", ""), oTargetObject, sPath, oDataModel);
								}
							}
							that.handleMoveFreightOrderToTruck(oNewDateTime.toISOString().replace(".000", ""), oNewEndDateTime.toISOString().replace(".000", ""), oTargetObject, sPath, oDataModel, iMoveWidthInMs);
						}
					});
					sap.m.MessageToast.show(`Freight Order updated successfully. Start: ${oNewDateTime}, End: ${oNewEndDateTime}`);
				}

			} catch (e) {
				console.error("API Error", e);
				console.error("Response", e?.response);
				console.error("Response Data", e?.response?.data);

				sap.m.MessageToast.show(
					e?.response?.data?.error?.message ||
					e?.message ||
					"Update failed"
				);
			}
		},

		handleMoveFreightUnitToTruck: function (oTime, oEndTime, oTargetObject, sPath, oModel) {
			var oData = oModel.getObject(sPath);

			var sTargetResourceId = oTargetObject.id;
			this.iNewFOCount++;
			var sNewFOId = "$" + this.iNewFOCount;

			oData.ParentRequirementID = sNewFOId;
			oData.ResourceID = sTargetResourceId;
			oData.StartTime = oTime;
			oData.EndTime = oEndTime;
			oData.HierarchyLevel = 1;
			oData.PlanStatus = "planned";

			var oFreightOrderData = {
				"RequirementID": sNewFOId,
				"ResourceID": sTargetResourceId,
				"Type": "FO",
				"PlanStatus": "planned",
				"StartTime": oTime,
				"EndTime": oEndTime,
				"SourceLocation": oData.SourceLocation,
				"DestinationLocation": oData.DestinationLocation,
				"ParentResourceID": sTargetResourceId,
				"ParentRequirementID": null,
				"HierarchyLevel": 0,
				"DrillState": "expanded"
			};

			oModel.create("/Requirements", oFreightOrderData);

			var mParameters = {
				success: function (oData) {
					mockserver.refreshResource(oModel, sTargetResourceId);
				},
				refreshAfterChange: false
			};
			oModel.update(sPath, oData, mParameters);
		},

		handleMoveFreightOrderToTruck: function (oTime, oEndTime, oTargetObject, sPath, oModel, iMoveWidthInMs) {

			var oData = oModel.getObject(sPath);
			var sCurrentResourceID = oData.id;
			var sTargetResourceID = oTargetObject.resourceId;

			if (sCurrentResourceID !== sTargetResourceID) {
				oData.StartTime = oTime;
				oData.EndTime = oEndTime;
				oData.PlanStatus = "planned";
				oData.ResourceID = sTargetResourceID;
				oData.ParentResourceID = sTargetResourceID;

				var mParameters = {
					success: function (oData) {
						oModel.read("/Resources('" + sTargetResourceID + "')", {
							urlParameters: {
								"$expand": "ResourceToRequirements"
							}
						});
					},
					refreshAfterChange: false
				};
				//oModel.update(sPath, oData, mParameters);
				oModel.setProperty(sPath, oData);
				oModel.refresh(true);
			} else {
				oModel.setProperty(sPath + "/Departure_Time", oTime, true);
				oModel.setProperty(sPath + "/Arrival_Time", oEndTime, true);
			}


			var aRequirements = oModel.getProperty("/Requirements") || [];

			aRequirements
				.filter(oNode => oNode.ParentRequirementID === oData.id)
				.forEach(function (oNode) {

					var sPath = "/Requirements/" +
						aRequirements.findIndex(r => r.id === oNode.id);

					oModel.setProperty(sPath + "/Departure_Time", oTime);
					oModel.setProperty(sPath + "/Arrival_Time", oEndTime);
				});

			


			if (!this.aChangedFOs) {
				this.aChangedFOs = [];
			}

			var sFormatted = oTime
				.replace(/[-:]/g, "")
				.replace("T", "")
				.replace("Z", "");

			this.aChangedFOs.push({

				IvTorKey: oData.transportationOrderUUID.replace(/-/g, "").toUpperCase(),
				IvTorID: oData.id,
				IvNewDepartureDatetime: sFormatted,
				IvDriverId: "",
				IvVehicleResId: ""
			});


			// oModel.read('/Requirements', {
			// 	success: function (oData) {
			// 		var aResult = oData.results;
			// 		aResult.forEach(function (oNode) {
			// 			var sUnitPath = "/Requirements('" + oNode.id + "')";
			// 			oModel.setProperty(sUnitPath + "/Departure_Time", oTime, true);
			// 			oModel.setProperty(sUnitPath + "/Arrival_Time", oEndTime, true);
			// 		});

			// 	},
			// 	error: function () {

			// 	},
			// 	urlParameters: {
			// 		"$filter": "ParentRequirementID eq " + oData.id
			// 	}
			// });


			// oModel.read('/UtilizationItems', {
			// 	success: function (oItemData) {
			// 		var aResult = oItemData.results;
			// 		aResult.forEach(function (oItem) {
			// 			var sUnitPath = "/UtilizationItems('" + oItem.UtilItemID + "')";
			// 			var oOldStartDateTime = oItem.StartTime;
			// 			var oOldEndDateTime = oItem.EndTime;
			// 			var oNewStartTime = new Date(oOldStartDateTime.getTime() + iMoveWidthInMs);
			// 			var oNewEndTime = new Date(oOldEndDateTime.getTime() + iMoveWidthInMs);
			// 			var oData = {
			// 				StartTime: oNewStartTime,
			// 				EndTime: oNewEndTime
			// 			};

			// 			oModel.update(sUnitPath, oData);
			// 		});

			// 	},
			// 	error: function () {

			// 	},
			// 	urlParameters: {
			// 		"$filter": "RootRequirementID eq " + oData.RequirementID
			// 	}
			// });

		},

		onLayoutChange: function (oEvent) {
			var oGanttChartContainer = this.byId("container");
			oGanttChartContainer.removeAllGanttCharts();
			var legendContainer = oGanttChartContainer.getToolbar().getLegendContainer();
			var sKey = oEvent.getParameter("selectedItem").getKey();
			switch (sKey) {
				case "ReqAndResAndDrv":
					legendContainer.getLegends()[0].setProperty("visible", true, true);
					legendContainer.getLegends()[0].getItems()[1].setProperty("visible", true, true);
					legendContainer.getLegends()[1].setProperty("visible", true, true);
					this.getGanttInstance("FreightOrder", "ReqAndResAndDrv", oGanttChartContainer);
					break;
				case "ReqAndRes":
					legendContainer.getLegends()[0].setProperty("visible", true, true);
					legendContainer.getLegends()[0].getItems()[1].setProperty("visible", true, true);
					legendContainer.getLegends()[1].setProperty("visible", true, true);
					this.getGanttInstance("FreightOrder", "ReqAndRes", oGanttChartContainer);
					//this.getGanttInstance("FreightOrderAndFreightUnit", "ReqAndRes", oGanttChartContainer);
					break;
				case "Resource":
					legendContainer.getLegends()[0].getItems()[1].setProperty("visible", false, true);
					legendContainer.getLegends()[1].setProperty("visible", true, true);
					this.getGanttInstance("Truck", "Resource", oGanttChartContainer);
					break;
				case "Requirement":
					legendContainer.getLegends()[0].setProperty("visible", true, true);
					legendContainer.getLegends()[0].getItems()[1].setProperty("visible", true, true);
					legendContainer.getLegends()[1].setProperty("visible", false, true);
					this.getGanttInstance("FreightOrderAndFreightUnit", "Requirement", oGanttChartContainer);
					break;
				case "Driver":
					legendContainer.getLegends()[0].setProperty("visible", true, true);
					legendContainer.getLegends()[0].getItems()[1].setProperty("visible", true, true);
					legendContainer.getLegends()[1].setProperty("visible", false, true);
					this.getGanttInstance("Driver", "Driver", oGanttChartContainer);
					break;
				default:
					return;
			}
		},

		onHierarchyChange: function (oEvent) {
			var oGanttChartContainer = this.byId("container");
			oGanttChartContainer.removeGanttChart(0);

			var sKey = oEvent.getParameter("selectedItem").getKey();

			switch (sKey) {
				case "FOFU":
					this.getGanttInstance("FreightOrderAndFreightUnit", "HeirarchyChange", oGanttChartContainer);
					break;
				case "FO":
					this.getGanttInstance("FreightOrder", "HeirarchyChange", oGanttChartContainer);
					break;
				case "FU":
					this.getGanttInstance("FreightUnit", "HeirarchyChange", oGanttChartContainer);
					break;
				default:
					return;
			}
		},

		getGanttInstance: function (sId, sKey, oGanttChartContainer) {
			var oView = this.getView();
			var oGantt = oView.byId(sId);
			if (!oGantt) {
				if (sId == "FreightOrderAndFreightUnit" && this.oFofuGantt) {
					oGanttChartContainer.insertGanttChart(this.oFofuGantt, 0);
				} else if (sId == "FreightOrder" && this.oFoGantt) {
					oGanttChartContainer.insertGanttChart(this.oFoGantt, 0);
				} else if (sId == "FreightUnit" && this.oFuGantt) {
					oGanttChartContainer.insertGanttChart(this.oFuGantt, 0);
				}
				Fragment.load({
					name: "dispatcherns.dispatcherproj.view." + sId,
					type: "XML",
					controller: this
				}).then(function (oGantt) {
					this._loadGanttChart(sKey, sId, true, oGanttChartContainer, oGantt);
				}.bind(this));
			} else {
				this._loadGanttChart(sKey, sId, false, oGanttChartContainer, oGantt);
			}
		},

		_loadGanttChart: function (sKey, sId, bisLoad, oGanttChartContainer, oGantt) {
			switch (sKey) {
				case "HeirarchyChange":
					if (bisLoad) {
						if (sId == "FreightOrderAndFreightUnit") {
							this.oFofuGantt = oGantt;
						} else if (sId == "FreightOrder") {
							this.oFoGantt = oGantt;
						} else if (sId == "FreightUnit") {
							this.oFuGantt = oGantt;
						}
					}
					oGanttChartContainer.insertGanttChart(oGantt, 0);
					break;
				case "ReqAndRes":
					oGanttChartContainer.addGanttChart(oGantt);
					this.getGanttInstance("Truck", "Resource", oGanttChartContainer);
					break;
				case "Resource":
					oGanttChartContainer.addGanttChart(oGantt);
					break;
				case "Requirement":
					oGanttChartContainer.addGanttChart(oGantt);
					break;
				default:
					return oGantt;
			}
		},
		_getOrderCreationDialog: function (bisOpen) {
			if (!this._oDialog) {
				Fragment.load({
					name: "dispatcherns.dispatcherproj.view.OrderCreate",
					type: "XML",
					controller: this
				}).then(function (_oDialog) {
					this._oDialog = _oDialog;
					_oDialog.setModel(new JSONModel(), "order");
					this.getView().addDependent(_oDialog);
					_oDialog.open();
				}.bind(this));
			} else if (bisOpen) {
				this._oDialog.open();
			} else {
				this._oDialog.close();
			}
		},

		_getDetailPopover: function (oShape, oEvent) {
			this.iPopoverOffsetX = oEvent.getParameter("popoverOffsetX");
			if (!this._oPopover) {
				Fragment.load({
					name: "dispatcherns.dispatcherproj.view.DetailPopover",
					type: "XML"
				}).then(function (oPopover) {
					this._oPopover = oPopover;
					this._oPopover.setModel(new JSONModel(), "popover");
					this.getView().addDependent(this._oPopover);
					this._oPopover.getModel("popover").setData({
						RequirementID: oShape.getShapeId(),
						SourceLocation: "",
						DestinationLocation: "",
						DepartureDate: oShape.getTime(),
						ArrivalDate: oShape.getEndTime()
					});
					this._oPopover.setOffsetX(this.iPopoverOffsetX).openBy(oShape);
				}.bind(this));

			} else {
				this._oPopover.setOffsetX(this.iPopoverOffsetX).openBy(oShape);
			}
		},

		onCreate: function (oEvent) {
			this._getOrderCreationDialog(true);
		},

		onConfirmCreateFreightOrder: function (oEvent) {
			var oDataModel = this.getView().getModel("data");
			this.iNewFOCount++;
			var sNewFOId = "$" + this.iNewFOCount;
			var oOrderData = this._oDialog.getModel("order").getData();

			var oFreightOrderData = {
				"RequirementID": sNewFOId,
				"ResourceID": oOrderData.Truck,
				"Type": "FO",
				"PlanStatus": "planned",
				"StartTime": oOrderData.DepartureDate,
				"EndTime": oOrderData.ArriveDate,
				"SourceLocation": oOrderData.SourceLocation,
				"DestinationLocation": oOrderData.DestinationLocation,
				"ParentResourceID": oOrderData.Truck,
				"ParentRequirementID": null,
				"HierarchyLevel": 0,
				"DrillState": "leaf"
			};

			var oController = this;
			var mParameters = {
				success: function (oData) {
					mockserver.refreshResource(oDataModel, oOrderData.Truck, function () {
						sap.m.MessageToast.show("Freight Order is created successfully");
						oController._getOrderCreationDialog(false);
					});
				},
				error: function (oData) {
					sap.m.MessageToast.show("Error when creating frieght order");
				},
				refreshAfterChange: false
			};
			oDataModel.create("/Requirements", oFreightOrderData, mParameters);
		},

		onDialogClose: function () {
			this._getOrderCreationDialog(false);
		},

		onDelete: function (oEvent) {
			var oControl = oEvent.getSource();
			while (!(oControl instanceof sap.gantt.simple.GanttChartWithTable)) {
				oControl = oControl.getParent();
			}
			var oDataModel = oControl.getModel("data");
			var aUid = oControl.getSelectedShapeUid();
			aUid.forEach(function (sShapeUid) {
				var o = Utility.parseUid(sShapeUid);
				var sPath = o.shapeDataName;
				var mParameters = {
					success: function () {
						sap.m.MessageToast.show("Freight Order is deleted");
					}
				};
				oDataModel.remove(sPath, mParameters);
			});
		},

		onOrderRescheduled: function (oEvent) {

			var oTableGantt = oEvent.getSource(),
				oDataModel = oTableGantt.getModel("data");

			var oShape = oEvent.getParameter("shape"),
				aNewTime = oEvent.getParameter("newTime"),
				sBindingPath = oShape.getBindingContext("data").getPath();

			oDataModel.setProperty(sBindingPath + "/StartTime", aNewTime[0], true);
			oDataModel.setProperty(sBindingPath + "/EndTime", aNewTime[1], true);
		},

		onShapeDoubleClick: function (oEvent) {
			var oShape = oEvent.getParameter("shape");

			if (oShape) {
				this._getDetailPopover(oShape, oEvent);
			}
		},

		onViewDocument: function (oEvent) {
			sap.m.MessageToast.show("Opening Document ...");
		},

		showUtilization: function () {
			var oGanttChartContainer = this.byId("container");
			var aGantts = oGanttChartContainer.getGanttCharts();
			aGantts.forEach(function (oGantt) {
				if (oGantt.getId().endsWith("Truck")) {
					oGantt.expand("truck_to_ulc", oGantt.getTable().getSelectedIndices()[0]);
				}
			});
		},

		hideUtilization: function () {
			var oGanttChartContainer = this.byId("container");
			var aGantts = oGanttChartContainer.getGanttCharts();
			aGantts.forEach(function (oGantt) {
				if (oGantt.getId().endsWith("Truck")) {
					oGantt.collapse("truck_to_ulc", oGantt.getTable().getSelectedIndices()[0]);
				}
			});
		},
		onLegendItemInteractiveChange: function (oEvent) {
			sap.m.MessageToast.show("Legend Item interactive value changed on shape: " + oEvent.getParameter("legendName"));
		},
		onGanttSidePanel: function (oEvent) {
			oEvent.getParameters().updateSidePanelState.enable();
		},
		onDisplayOverlay: function () {
			var oGantt = this.getView().byId("sampleComp-sap.gantt.sample.GanttChartContainer---RootView--Truck");
			this._toggleoverlay = !this._toggleoverlay;
			if (oGantt) {
				oGantt.showWrapper(this._toggleoverlay);
			}
			var oContainer = this.byId("container");
			this._toggleoverlayforcontainer = !this._toggleoverlayforcontainer;
			if (oContainer) {
				oContainer.showWrapper(this._toggleoverlayforcontainer);
			}
		},
		onSaveData: async function () {

			if (!this.aChangedFOs || this.aChangedFOs.length === 0) {
				sap.m.MessageToast.show("No changes found");
				return;
			}

			try {

				const payload = {
					Updates: this.aChangedFOs
				};

				await FreightOrderService.SaveFO(payload);



				this.aChangedFOs = [];

				await this.getOwnerComponent().loadMasterData();
				this.getView().getModel("data").refresh(true);

				sap.m.MessageToast.show("Freight Orders saved successfully and refreshed successfully");

			} catch (error) {

				sap.m.MessageToast.show("Save failed");
				console.error(error);
			}

		},
		onAISettings: function () {
			if (!this._oAISettingsDialog) {
				this._oAISettingsDialog =
					sap.ui.xmlfragment(
						this.getView().getId(),
						"dispatcherns.dispatcherproj.view.AISettings",
						this
					);
				//"dispatcherns.dispatcherproj.view.OrderCreate"
				this.getView().addDependent(
					this._oAISettingsDialog
				);
			}
			this._oAISettingsDialog.open();
		},

		onApplyAISettings: function () {
			var oSettings =
				this.getView().getModel("ai").getData();
			console.log("AI Settings", oSettings);
			MessageToast.show(
				"AI Optimization Settings Applied"
			);
			this._oAISettingsDialog.close();
		},

		onResetAISettings: function () {
			this.getView().getModel("ai").setData({

				outsideShiftHours: 2,
				workloadFactor: 70,
				maxIdleTime: 2,
				driverPreference: true,
				emptyMiles: true,
				homeLocation: true,
				overtimeOptimization: false,
				strategyIndex: 1
			});
			MessageToast.show(
				"Settings Reset"
			);
		},

		onAIAnalytics: function () {
			if (!this._oAIAnalyticsPage) {
				this._oAIAnalyticsPage =
					sap.ui.xmlfragment(
						this.getView().getId(),
						"dispatcherns.dispatcherproj.view.AIAnalytics",
						this
					);
				this.getView().getParent().addPage(this._oAIAnalyticsPage);
			}
			this._loadAnalyticsData();
			this.getView().getParent().to(this._oAIAnalyticsPage.getId());
			window.open(this._oAIAnalyticsPage, "_blank");
		},

		onCloseAIAnalytics: function () {
			this.getView().getParent().back();
		},

		_loadAnalyticsData: function () {
			var oModel = new sap.ui.model.json.JSONModel({
				aiAdoption: 89,
				foCoverage: 98,
				planningScore: 87,
				complianceScore: 100,
				costSavings: 12450,
				aiVsManual: [
					{
						metric: "Coverage",
						ai: "98%",
						manual: "93%"
					},
					{
						metric: "Empty Miles",
						ai: "890",
						manual: "1120"
					},
					{
						metric: "Idle Hours",
						ai: "214",
						manual: "302"
					}
				],
				assignmentQuality: [
					{
						metric: "Workload Balance",
						score: 91
					},
					{
						metric: "Route Quality",
						score: 94
					},
					{
						metric: "Vehicle Utilization",
						score: 88
					},
					{
						metric: "Time Window Adherence",
						score: 97
					}
				],
				driverUtilization: [
					{
						driverName: "Driver D001",
						utilization: 92
					},
					{
						driverName: "Driver D002",
						utilization: 78
					},
					{
						driverName: "Driver D003",
						utilization: 64
					},
					{
						driverName: "Driver D004",
						utilization: 88
					}
				]
			});
			this._oAIAnalyticsPage.setModel(
				oModel,
				"analytics"
			);
		},

		onEURegulations: function () {
			this._loadEURegulationData();

			if (!this._oEUDialog) {

				this._oEUDialog = sap.ui.xmlfragment(
					this.getView().getId(),
					"dispatcherns.dispatcherproj.view.driverRegulations",
					this
				);

				this.getView().addDependent(this._oEUDialog);
			}

			this._oEUDialog.open();
		},

		_loadEURegulationData: function () {
			var oModel = this.getView().getModel("eu");

			if (!oModel) {
				oModel = new JSONModel({
					editMode: false,
					REGULATION_ID: "EU561",
					COUNTRY_CODE: "EU",
					REGULATION_VERSION: "561/2006",
					MAX_DAILY_DRIVING_HRS: 9,
					EXTENDED_DAILY_HRS: 10,
					MAX_WEEKLY_HRS: 56,
					MAX_FORTNIGHT_HRS: 90,
					BREAK_AFTER_HRS: 4.5,
					BREAK_DURATION_MIN: 45,
					DAILY_REST_HRS: 11,
					REDUCED_DAILY_REST_HRS: 9,
					WEEKLY_REST_HRS: 45,
					MAX_CONSEC_WORK_DAYS: 6,
					ACTIVE: true,
					VALID_FROM: "2026-01-01",
					VALID_TO: "9999-12-31"
				});

				this.getView().setModel(oModel, "eu");
			}
		},

		onCreateEURegulation: function () {
			var oModel = this.getView().getModel("eu");
			oModel.setProperty("/editMode", true);
			MessageToast.show("New regulation version ready for editing");
		},

		onEditEURegulation: function () {
			var oModel = this.getView().getModel("eu");
			oModel.setProperty("/editMode", true);
		},

		onCloseEURegulation: function () {
			this._oEUDialog.close();
		},

		onSaveEURegulation: function () {
			var oModel = this.getView().getModel("eu");
			var oData =
				this.getView()
					.getModel("eu")
					.getData();

			// OData create/update call

			MessageToast.show(
				"Driver Regulation Configuration Saved..."
			);
			oModel.setProperty("/editMode", false);
		},


	});
});
