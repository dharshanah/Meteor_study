Template.postSubmit.events ({
	'submit form' : function(e){
		e.preventDefault();
		var post = {
			url : $(e.target).find('[name=url]').val(),
			title : $(e.target).find('[name=title]').val()
		}
		var errors = validatePosts(post);
		if(errors.title || errors.url){
			return Session.set('postSubmitErrors',errors);
		}
		Meteor.call('postInsert' ,post, function(error, response){
			if(error){
				return throwError(error.reason);
			}
			if(response.postExists){
				throwError('Url already exist. Redirecting');			}
			Router.go('postPage',{_id : response._id});
		});
	}
})

//This postSubmitErrors session object will be used to show errors in the form
//We create a new object when template is created so that any previous errors are cleared in the form
Template.postSubmit.created = function() {
	Session.set('postSubmitErrors', {});
}

Template.postSubmit.helpers({
	errorMessage : function(field) {
		return Session.get('postSubmitErrors')[field];
	},
	errorClass : function(field) {
		return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
	}
});