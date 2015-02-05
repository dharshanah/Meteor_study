Posts = new Mongo.Collection('posts');

/** This becomes irrelevant once we start using Meteor.methods
Posts.allow({
	insert : function(userId , doc){
		return !! userId;
	}
	
});
**/

Meteor.methods({
   postInsert : function(postAttributes){
   		check(Meteor.userId(), String);
   		check(postAttributes ,{
   			title : String,
   			url : String
   		});
   		//This code check is to understand Latency Compensation
   		if(Meteor.isServer){
   			postAttributes.title += "(server)";
   			Meteor._sleepForMs(5000);

   		} else {
   			postAttributes.title += "(client)";
   		}
   		var postWithSameUrl = Posts.findOne({url: postAttributes.url});
   		if(postWithSameUrl){
   			return {
   				postExists: true,
   				_id : postWithSameUrl._id
   			};
   		}
   		var user = Meteor.user();
   		var post = _.extend(postAttributes ,{
   			userId : user._id,
   			author : user.name,
   			submitted : new Date()
   		});

   		var postId = Posts.insert(post);
   		return {
   			_id : postId
   		};

   }
});