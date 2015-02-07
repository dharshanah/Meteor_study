//Router.configure sets these values to global level
//So in this case posts will be loaded only once when
//the user accesses the app. And this will be available to
//all the routes
Router.configure({
	layoutTemplate : 'layout',
	loadingTemplate : 'loading',
	waitOn : function(){
		return [Meteor.subscribe('notifications')];
	},
	notFoundTemplate : 'notFound'
});
Router.route('/posts/:_id',{
	name : 'postPage',
	waitOn : function(){
		return [
		Meteor.subscribe('singlePost', this.params._id),
		Meteor.subscribe('comments',this.params._id)
		];
	},
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

PostsListController = RouteController.extend({
	template : 'postsList',
	increment : 5,
	postsLimit : function(){
		return parseInt(this.params.postsLimit) || this.increment;
	},
	findOptions : function(){
		return {sort :{submitted : -1} , limit : this.postsLimit()};
	},
	//WaitOn is commented out because each time data is loaded , it goes to the loading template
	//and then user has to scroll all the way back again . So we are just going to use
	//a subscriptions hook which will not return the posts but will just fetch them
	// And then we use a ready on these subsciptions to make sure that we get notified once the 
	//data is ready. Till then the spinner is loaded
	/*waitOn : function(){
		return Meteor.subscribe('posts' , this.findOptions());
	},*/
	subscriptions: function(){
		this.postsSub = Meteor.subscribe('posts' , this.findOptions());
	},
	posts: function() {
		return Posts.find({}, this.findOptions());
	},
	data: function() {
		//Here this.posts().count() refers to the number of posts in the current cursor
		//that is retrieved based on the findOptions. this.posts().count() does not
		//refer to the entire post count in dB rather the data context that is obtained by the
		//data function . So in this case we check if we have asked for n posts and we have got
		// n posts . Then this mean there are more posts . If we ask for n and we have got <n ,
		//then that means no more posts. This fails only in one condition where there are exactly 
		//n posts
		var hasMore = this.posts().count() === this.postsLimit();
		var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});
		return {
			posts: this.posts(),
			ready : this.postsSub.ready(),
			nextPath: hasMore ? nextPath : null
		};	
	}
});

Router.route('/:postsLimit?', {
	name : 'postsList'
});
//The following statement tells the router to show the notFound 404 for postPage template
//in case there is no post with the _id param value in url. That is if the data function returns falsy
//('null' or 'false' or 'undefined' or empty) object.
Router.onBeforeAction('dataNotFound' , {only : 'postPage'})
Router.onBeforeAction(requireLogin , {only : 'postSubmit'})
