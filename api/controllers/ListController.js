/**
 * ListController
 *
 * @description :: Server-side logic for managing lists
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	addList:function (req, res) {
		var data_from_client = req.params.all();
		if (req.isSocket && req.method === 'POST') {
			// New list added by connected client. Add to list.
			List.create(data_from_client)
				.exec(function (err, data_from_client) {
					List.publishCreate({id: data_from_client.id, name: data_from_client.name});
					List.find({id: data_from_client.id}).populate('collaborators').exec(console.log);
				});
		} else if (req.isSocket) {
			// Subscribe to list changes.
			List.watch(req.socket);
		}
	}
};
