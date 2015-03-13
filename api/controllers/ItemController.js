/**
 * ItemController
 *
 * @description :: Server-side logic or managing items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	subscribe: function (req, res) {
		// Get all of the users
		Item.find().exec(function (err, items) {
			// Subscribe the requesting socket to all items
			Item.subscribe(req.socket, items);
		});
	},

	getItems: function (req, res) {
		Item.find({}).exec(function(e,listOfUsers){
			Item.subscribe(req.socket,listOfUsers);
		});
	},

	addItem: function (req, res) {
		var data_from_client = req.params.all();

		if (req.isSocket && req.method === 'POST') {
			// New item added by connected client. Add to list.
			Item.create(data_from_client)
				.exec(function(err, data_from_client){
					Item.publishCreate({id: data_from_client.id, text: data_from_client.text, list: data_from_client.list});
				});
		} else if (req.isSocket) {
			// Subscribe to list changes.
			Item.watch(req.socket);
		}
	},

	// an UPDATE action
    updateItem: function (req, res, next) {
        var criteria = {};
        criteria = _.merge({}, req.params.all(), req.body);

        var id = req.param('id');

        if (!id) {
            return res.badRequest('No id provided.');
        }

        if (req.isSocket && req.method === 'PUT') {
	        Item.update(id, criteria).exec(function(err, updated){
	        	Item.publishUpdate(updated[0].id, {finished: criteria.finished, list: updated[0].list})
	        });
        }
    }

};
