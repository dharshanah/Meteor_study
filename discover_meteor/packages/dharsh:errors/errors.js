
//Create a local client-only collection to store errors for the session
Errors = {
	collection : new Mongo.Collection(null),

	//The advantage of local collections is that like all collections this is also highly reactive
	throw : function(message){
		Errors.collection.insert({message : message, seen : false});
	}
};

