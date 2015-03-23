/**
 * ItemController
 *
 * @description :: Server-side logic or managing items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	addItem: function (req, res) {
		var listId = req.param('listId'); // ID of the list of the item to be updated
		var itemText = req.param('text'); // ID of the list of the item to be updated

		var newItem = {list: listId, text: itemText};

		List.findOne({id: listId}).exec(function (err, found) {
			console.log(listId);
			if (err || typeof found === 'undefined') {
				console.error("Error when trying to add item to list " + listId + ".");
			} else {
				Item.create(newItem).exec(function(err, newItem) {
					if (err || typeof newItem === 'undefined') {
						console.error("Error when trying to add item to list " + listId + ".");
					} else {
						sails.sockets.broadcast(listId, 'itemAdded', 
							{	id: newItem.id, 
								text: newItem.text, 
								list: newItem.list, 
								finished: false	
							});
					}
				});
			}
		});
	},

	removeItem: function (req, res) {
		var itemId = req.param('id'); // ID of the list of the item to be removed
		
		Item.findOne({id: itemId}).exec(function (err, found) {
			var listId = found.list;

			if (err || typeof found === 'undefined') {
				console.error("Error when trying to remove item " + itemId + ".");
			} else {
				Item.destroy({list: listId, id: itemId}).exec(function(err, data){
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
