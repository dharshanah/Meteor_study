//Router.configure sets these values to global level
//So in this case posts will be loaded only once when
//the user accesses the app. And this will be available to
//all the routes
Router.configure({
	layoutTemplate : 'layout',
	loadingTemplate : 'loading',
	waitOn : function(){
		return [Meteor.subscribe('posts'),Meteor.subscribe('comments')];
	},
	notFoundTemplate : 'notFound'
});
Router.route('/', {name : 'postsList'});
Router.route('/posts/:_id',{
	name : 'postPage',
	data : function(){
		return Posts.findOne(this.params._id);
	}
});
Router.route('/posts/:_id/edit',{
	name : 'postEdit',
	data : function(){
		return Posts.findOne(this.params._id);
	}
});
var requireLogin = function(){
	if(!Meteor.user()){
		if(Meteor.loggingIn()){
			this.render(this.loadingTemplate);
		}
		else {
			this.render('accessDenied');
		}
	}
	else {
		this.next();
	}
}
Router.route('/submit' , {name : 'postSubmit'});
//The following statement tells the router to show the notFound 404 for postPage template
//in case there is no post with the _id param value in url. That is if the data function returns falsy
//('null' or 'false' or 'undefined' or empty) object.
Router.onBeforeAction('dataNotFound' , {only : 'postPage'})
Router.onBeforeAction(requireLogin , {only : 'postSubmit'})
