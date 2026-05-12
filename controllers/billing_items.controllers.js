const billing_itemsDAO = require("../dao/billing_items.dao.js");

const billing_items_instance = new billing_itemsDAO();

module.exports = {
    getAllBillingItems: function (req, res, next) {
        billing_items_instance.getAllBillingItems(req, res, next);
    },
    getBillingItemsByBillingId: function (req, res, next) {
        billing_items_instance.getBillingItemsByBillingId(req, res, next);
    },
    addBillingItem: function (req, res, next) {
        billing_items_instance.addBillingItem(req, res, next);
    },
    updateBillingItem: function (req, res, next) {
        billing_items_instance.updateBillingItem(req, res, next);
    },
};
