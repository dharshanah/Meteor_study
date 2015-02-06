Template.errors.helpers({
	errors: function() {
		return Errors.find();
	}
});
//This is to make sure that the errors don't get stacked up and the
//DOM is cleared . Due to high reactivity , removing the errors from the local
//collections clears the DOM elements as well.
//This rendered callback is triggered once our error template is rendered on the browser
Template.error.rendered = function(){
	var error = this.data;
	Meteor.setTimeout(function(){
		Errors.remove(error._id);
	},3000);
};