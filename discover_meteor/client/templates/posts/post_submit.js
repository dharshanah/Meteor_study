Template.postSubmit.events ({
	'submit form' : function(e){
		e.preventDefault();
		var post = {
			url : $(e.target).find('[name=url]').val(),
			title : $(e.target).find('[name=title]').val()
		}
		Meteor.call('postInsert' ,post, function(error, response){
			if(error){
				return alert("Error " + error.reason);
			}
			if(response.postExists){
				alert('Url already exist. Redirecting')
			}
			//Commented for the sake of demonstrating Latency Compensation
			//Router.go('postPage',{_id : response._id});
		});
		//Temp Route
		Router.go('postsList');
		
	}
})