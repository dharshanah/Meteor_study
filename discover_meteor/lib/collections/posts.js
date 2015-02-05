Posts = new Mongo.Collection('posts');

//This becomes irrelevant  for insert because we have used a Method for it usimg Meteor.methods 
Posts.allow({
	update : function(userId , doc){
		return ownsDocument(userId, doc);
	},
	remove : function(userId , doc){
      return ownsDocument(userId, doc);
   },
});

Posts.deny({
   update : function(userId , doc, fieldNames){
      return (_.without(fieldNames,'url','title').length>0);
   }
});


Meteor.methods({
   postInsert : function(postAttributes){
   		check(Meteor.userId(), String);
   		check(postAttributes ,{
   			title : String,
   			url : String
   		});
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
   			author : user.username,
   			submitted : new Date()
   		});

   		var postId = Posts.insert(post);
   		return {
   			_id : postId
   		};

   }
});