/**
 * ListController
 *
 * @description :: Server-side logic for managing lists
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	getLists:function (req, res) {
		List.find().exec(function (err, lists) {
			if (err) {
				console.error("Error trying to find all lists: " + err);
			} else {
				res.json(lists);
			}
		});
	},

	getItems:function (req, res) {
		var listId = req.params.id; // id of the list of which we want to find the items
		Item.find({list: listId}).exec(function (err, items) {
			if (err) {
				console.error("Error trying to items in list: " + listId);
			} else {
				res.json(items);
			}
		});
	},

	addList:function (req, res) {
		var listName = req.param('listName');
//		var data_from_client = req.params.all();
		if (req.isSocket && req.method === 'POST') {
			// New list added by connected client. Add to list.
			List.create({name: listName})
				.exec(function (err, res) {
					sails.sockets.broadcast('lists', 'listAdded', {id: res.id, name: res.name});
				});
		} else if (req.isSocket) {
			// Subscribe to list changes.
			List.watch(req.socket);
		}
	},

	removeList:function (req, res) {
		var data_from_client = req.params.all();
		if (req.isSocket && req.method === 'PUT') {
			// New list added by connected client. Add to list.
			List.destroy(data_from_client)
				.exec(function (err, data_from_client) {
					sails.sockets.broadcast('lists', 'listRemoved', {id: req.param("id")});
				});
		}
	},

	subscribeToList: function (req, res) {
		var listId = req.param('id');
		sails.sockets.join(req.socket, listId);
		res.json({
			message: 'Subscribed to list with id '+listId+'.'
		});
	},

	subscribeToLists: function (req, res) {
		sails.sockets.join(req.socket, 'lists');
		res.json({
			message: 'Subscribed to list of all lists.'
		});
	},
};
