/*global QUnit*/

sap.ui.define([
	"dispatcherns/dispatcherproj/controller/DispatcherView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("DispatcherView Controller");

	QUnit.test("I should test the DispatcherView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
