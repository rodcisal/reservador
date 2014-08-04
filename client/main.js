//Subscribes to user list
Meteor.subscribe("users");

Meteor.subscribe("gamesList");
Games = new Meteor.Collection("games");

UI.registerHelper("facebookImageUrl", function(id, size) {
  return "http://graph.facebook.com/" + id + "/picture/?type="+size;
});

Meteor.startup(function() {
  moment.lang("es");
  //single mode by default
  Session.setDefault('gameMode', 'single');
});

Template.main.users = function() {
  return Meteor.users.find();
}

Template.main.gamesList = function() {
  return Games.find({},{sort: {date: -1}});
}

Template.main.gameModeDouble = function() {
  if (Session.get('gameMode') === 'double'){
    return true
  }
}

Template.main.partnerSelected = function() {
  if (Session.get('gameMode') === 'double' && Session.get('partnerPlayer')) {
    return true;
  }
}

//functions
function cleanUser () {
  Session.set('selectedPlayer', undefined);
  $(".user").removeClass('background-color-yellow');
  $('.addMatchConfirmation').hide();
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
    var $this = $(e.target);
    //store userName on Session
    Session.set('myNameis', Meteor.user().profile.name);

    // SINGLE MODE
    if (Session.get('gameMode') === 'single') {
      //prevent multiple player selection  & select myself as oponent
      if (!Session.get('selectedPlayer') ){
        Session.set("firstPlayerId", Meteor.user().services.facebook.id);
        Session.set("selectedPlayer", this.profile.name);
        Session.set("selectedPlayerId", this.services.facebook.id);
        $this.css('display', 'none');
        $this.parent().addClass('background-color-yellow');
        $this.siblings(".addMatchConfirmation").css("display","block");
      }
    }

    // DOUBLE MODE
    if (Session.get('gameMode') === 'double') {

      if ( !Session.get('selectedPlayer' ) ) {
        if ( Session.get('partnerPlayer') ) {
          Session.set('selectedPlayer', this.profile.name);
          $this.parent().css('background-color', 'yellow');
        } else {
          Session.set('partnerPlayer', this.profile.name);
          $this.parent().css('background-color', 'green');
        }
        return false;
      }

      if (Session.get('partnerPlayer') && Session.get('selectedPlayer') ) {
        Session.set('selectedPlayerPartner', this.profile.name);
        $this.parent().css('background-color', 'pink');
        return false;
      }
    }

  },
  "click .endGame": function(e) {
    e.preventDefault();
    var gameId = this._id;
    Meteor.call('endMatch', gameId);
  },
  "click .coupleMode": function(e) {
    e.preventDefault();
    //double mode activated
    Session.set('gameMode', 'double');
    cleanUser();
  },
  "click .singleMode": function(e) {
    e.preventDefault();
    //single mode activated
    Session.set('gameMode', 'single');
  }
})