//Subscribes to user list
Meteor.subscribe("users");

Meteor.subscribe("gamesList");
Games = new Meteor.Collection("games");

UI.registerHelper("facebookImageUrl", function(id, size) {
    return "http://graph.facebook.com/" + id + "/picture/?type="+size;
});

Meteor.startup(function() {
  moment.lang("es");
});

Template.main.users = function() {
  return Meteor.users.find();
}

Template.main.gamesList = function() {
  return Games.find({},{sort: {date: -1}});
}

Template.main.events({
  "click .addMatchConfirmation": function(e){
    e.preventDefault();
    var firstPlayer = Meteor.user().profile.name;
    var firstPlayerId = Session.get('firstPlayerId');
    var secondPlayer = Session.get("selectedPlayer");
    var secondPlayerId = Session.get('selectedPlayerId');
    var state = "activo";
    Meteor.call("addMatch", firstPlayer, firstPlayerId, secondPlayer, secondPlayerId, state);
    $.scrollTo($('.firstPlayer:first-child'), 1000);
  },
  "click .addMatch" : function(e) {
    e.preventDefault();
    console.log('.addMatch');
    //store userName on Session
    Session.set('myNameis', Meteor.user().profile.name);
    //prevent multiple player selection  & select myself as oponent
    if (!Session.get('selectedPlayer') && Session.get('myNameis') !== this.profile.name){
      Session.set("firstPlayerId", Meteor.user().services.facebook.id);
      Session.set("selectedPlayer", this.profile.name);
      Session.set("selectedPlayerId", this.services.facebook.id);
      var $this = $(e.target);
      $this.css('display', 'none');
      $this.parent().addClass('background-color-yellow');
      $this.siblings(".addMatchConfirmation").css("display","block");
    }
  },
  "click .endGame": function(e) {
    e.preventDefault();
    var gameId = this._id;
    Meteor.call('endMatch', gameId);
  }
})