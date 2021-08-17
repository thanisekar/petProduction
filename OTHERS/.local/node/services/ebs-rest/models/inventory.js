'use strict';
var occInventory =  require('../lib/occ_inventory');
module.exports = function (Inventory) {
    Inventory.createInventory = function (inventoryPayload, callback) {
        occInventory.createInventory(inventoryPayload, function (error, result) {
            return callback(error, result);
        });
        //http://localhost:3000/b2c/api/v1/inventories/createinventory
    };

    Inventory.updateInventory = function (sku, inventoryUpdatePayload, callback) {
        occInventory.updateInventory(sku, inventoryUpdatePayload, function (error, result) {
            return callback(error, result);
        });
        //http://localhost:3000/b2c/api/v1/inventories/updateinventory/loc1
    };

    Inventory.remoteMethod(
        'createInventory', {
            http: {
                path: '/createinventory/',
                verb: 'post'
            },
            accepts: [
                {
                    arg: 'inventoryPayload',
                    type: 'object',
                    required: true,
                    http: { source: 'body' }
                }
            ],
            returns: {
                type: 'object',
                root: true
            }
        }
    );

    Inventory.remoteMethod(
        'updateInventory', {
            http: {
                path: '/updateinventory/:sku/',
                verb: 'put'
            },
            accepts: [
                {
                    arg: 'sku',
                    type: 'string',
                    required: true,
                },
                {
                    arg: 'inventoryUpdatePayload',
                    type: 'object',
                    required: true,
                    http: { source: 'body' }
                }
            ],
            returns: {
                type: 'object',
                root: true
            }
        }
    );
};
