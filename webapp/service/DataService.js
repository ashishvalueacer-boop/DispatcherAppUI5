sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (JSONModel, MessageToast, MessageBox) {
    "use strict";

    const CONFIG = {
        BASE_URL: "/api/v1"
    };

    return {

        /**
         * Generic GET Request
         */
        async get(endpoint) {
            try {
                const response = await fetch(
                    `${CONFIG.BASE_URL}${endpoint}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status} - ${response.statusText}`
                    );
                }

                return await response.json();

            } catch (error) {

                MessageBox.error(
                    `Failed to retrieve data: ${error.message}`
                );

                throw error;
            }
        },

        /**
         * Generic POST Request
         */
        async post(endpoint, payload) {

            try {

                const response = await fetch(
                    `${CONFIG.BASE_URL}${endpoint}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    }
                );

                if (!response.ok) {

                    const errorResponse =
                        await response.json();

                    throw new Error(
                        errorResponse.message ||
                        "Service call failed."
                    );
                }

                return await response.json();

            } catch (error) {

                MessageBox.error(error.message);

                throw error;
            }
        }
    };
});