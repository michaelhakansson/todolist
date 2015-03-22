/**
 * ItemController
 *
 * @description :: Server-side logic or managing items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	addItem: function (req, res) {
		var data_from_client = req.params.all();
		var listId = req.body.list; // ID of the list of the item to be updated
		List.findOne({id: listId}).exec(function (err, found) {
			if (err || typeof found === 'undefined') {
				console.error("Error when trying to add item to list " + listId + ".");
			} else {
				Item.create(data_from_client).exec(function(err, data_from_client) {
					if (err || typeof data_from_client === 'undefined') {
						console.error("Error when trying to add item to list " + listId + ".");
					} else {
						sails.sockets.broadcast(listId, 'itemAdded', 
							{	id: data_from_client.id, 
								text: data_from_client.text, 
								list: data_from_client.list, 
								finished: false	
							});
					}
				});
			}
		});
	},

	removeItem: function (req, res) {
		var data_from_client = req.params.all();
		var listId = req.body.list; // ID of the list of the item to be removed
		var itemId = data_from_client.id; // ID of the item to be removed
		List.findOne({id: listId}).exec(function (err, found) {
			if (err || typeof found === 'undefined') {
				console.error("Error when trying to remove item " + itemId + " from list " + listId + ".");
			} else {
				Item.destroy(data_from_client).exec(function(err, data_from_client){
					sails.sockets.broadcast(listId, 'itemRemoved', {id: itemId});
				});
			}
		});
	},

	updateItem: function (req, res, next) {
		var id = req.param('itemId'); // ID of item to be updated
		var newStatus = req.param('newStatus') === 'true';
		var listId = req.param('listId'); // ID of the list of the item to be updated

		if (req.isSocket && req.method === 'PUT') {
			Item.update(id, {finished: newStatus}).exec(function(err, updated){
				sails.sockets.broadcast(listId, 'updatedItem', {	id: updated[0].id,
																	text: updated[0].text, 
																	finished: newStatus, 
																	list: updated[0].list});
			});
		}
	}

};
