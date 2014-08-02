//Subscribes to user list
Meteor.subscribe("users");

Meteor.subscribe("gamesList");
Games = new Meteor.Collection("games");

Template.main.helpers({
  facebookImageUrl: function(id) {
    return "http://graph.facebook.com/" + id + "/picture/?type=large";
  }
});

Template.main.users = function() {
  return Meteor.users.find();
}
  
Template.main.gamesList = function() {
  return Games.find();
}

Template.main.events({
  "click .addMatch": function(e){
    e.preventDefault();
    var firstPlayer = Meteor.user().profile.name;
    var secondPlayer = 
    Meteor.call("addMatch", firstPlayer, secondPlayer, state);
  },
  "click .user" : function() {
    Session.set("selectedPlayer", this.profile.name);
    console.log(Session.get("selectedPlayer"));
  }
})