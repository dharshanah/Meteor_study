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

Posts.deny({
   update: function(userId, post, fieldNames, mod) {
      var errors = validatePosts(mod.$set);
      return errors.title || errors.url;
   }
});


Meteor.methods({
   postInsert : function(postAttributes){
   		check(Meteor.userId(), String);
   		check(postAttributes ,{
   			title : String,
   			url : String
   		});
         var errors = validatePosts(postAttributes);
         if (errors.title || errors.url)
            throw new Meteor.Error("invalid-post","You must set a title and URL for your post");
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

validatePosts = function(post){
   var errors = {};
   if(!post.title){
      errors.title = "Please fill in a headLine" ;
   }
   if(!post.url){
      errors.url = "Please fill in a url" ;
   }
   return errors;
};