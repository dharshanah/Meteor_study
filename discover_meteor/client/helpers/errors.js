//Create a local client-only collection to store errors for the session
Errors = new Mongo.Collection(null);

//The advantage of local collections is that like all collections this is also highly reactive
throwError = function(message){
	Errors.insert({message : message});
}

