//Router.configure sets these values to global level
//So in this case posts will be loaded only once when
//the user accesses the app. And this will be available to
//all the routes
Router.configure({
	layoutTemplate : 'layout',
	loadingTemplate : 'loading',
	waitOn : function(){
		return Meteor.subscribe('posts');
	}
});
Router.route('/', {name : 'postsList'});
