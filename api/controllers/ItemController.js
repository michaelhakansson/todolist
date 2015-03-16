/**
 * ItemController
 *
 * @description :: Server-side logic or managing items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	subscribeToList: function (req, res) {
		var listId = req.param('id');
		sails.sockets.join(req.socket, listId);
		res.json({
			message: 'Subscribed to list with id '+listId+'.'
		});
	},

	getItems: function (req, res) {
		Item.find({}).exec(function(e,listOfUsers){
			Item.subscribe(req.socket,listOfUsers);
		});
	},

	addItem: function (req, res) {
		var data_from_client = req.params.all();
		var listId = req.body.list; // ID of the list of the item to be updated
		List.findOne({id: listId}).exec(function (err, found) {
			if (err || typeof found === 'undefined') {
				console.error("Error when trying to add item to list " + listId + ".");
			} else {
				Item.create(data_from_client).exec(function(err, data_from_client){
					sails.sockets.broadcast(listId, 'itemAdded', {	id: data_from_client.id, 
													text: data_from_client.text, 
													list: data_from_client.list, 
													finished: false	});
				});
			}
		});
	},

	updateItem: function (req, res, next) {
		var id = req.param('id'); // ID of item to be updated
		var listId = req.body.list; // ID of the list of the item to be updated
		var data_from_client = req.params.all();
		var newStatus = data_from_client.finished;

		if (req.isSocket && req.method === 'PUT') {
			Item.update(id, {finished: newStatus}).exec(function(err, updated){
				sails.sockets.broadcast(listId, 'updatedItem', {	id: updated[0].id, 
																	finished: newStatus, 
																	list: updated[0].list});
			});
		}
	}

};
