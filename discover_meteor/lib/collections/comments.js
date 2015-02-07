Comments = new Mongo.Collection('comments');

Meteor.methods({
   commentInsert : function(commentAttributes){
   		check(Meteor.userId(), String);
   		check(commentAttributes ,{
   			postId : String,
   			body : String
   		});
        
   		var user = Meteor.user();
   		var post = Posts.findOne(commentAttributes.postId);
   		if(!post){
   			throw new Meteor.Error('invalid-comment', 'You must comment on a post');
   		}

   		var comment = _.extend(commentAttributes ,{
   			userId : user._id,
   			author : user.username,
   			submitted : new Date()
   		});

   		Posts.update(comment.postId, {$inc :{commentsCount : 1}});
   		comment_id =  Comments.insert(comment);
   		createCommentNotification(comment);
   		return comment_id;
   }
});