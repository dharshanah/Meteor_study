Template.postEdit.events ({
	'submit form' : function(e){
		e.preventDefault();
		var currentPostId = this._id;
		var postProperties = {
			url : $(e.target).find('[name=url]').val(),
			title : $(e.target).find('[name=title]').val()
		}
		/*Meteor.call('postUpdate' ,post, function(error, response){
			if(error){
				return alert("Error " + error.reason);
			}
			if(response.postExists){
				alert('Url already exist. Redirecting')
			}
			Router.go('postPage',{_id : response._id});
		});*/
		Posts.update(currentPostId, {$set : postProperties} , function(error){
			if(error){
				Errors.throw(error.reason);
			}else{
				Router.go('postPage' , {_id : currentPostId});
			}
		});
	},
	'click .delete' : function(e){
		e.preventDefault();
		if(confirm("Do you really want to delete this post ?")){
			var currentPostId = this._id;
			Posts.remove(currentPostId);
			Router.go('postsList');
		}
	}
})
Template.postEdit.created = function() {
	Session.set('postEditErrors', {});
}

Template.postEdit.helpers({
	errorMessage: function(field) {
		return Session.get('postEditErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
	}
});