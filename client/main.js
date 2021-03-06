//Subscribes to user list
Meteor.subscribe("users");

Meteor.subscribe("gamesList");
Games = new Meteor.Collection("games");

UI.registerHelper("facebookImageUrl", function(id, size) {
  return "http://graph.facebook.com/" + id + "/picture/?type="+size;
});

UI.registerHelper("isDouble", function(type) {
  return (type === 'double') ? true : false;
});

Meteor.startup(function() {
  moment.lang("es");
  //single mode by default
  Session.setDefault('gameMode', 'single');
});


Template.loginButtons.rendered = function() {
  $('#login-buttons-logout').html('Salir');
}
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

function cleanUser () {
  Session.set('selectedPlayer', undefined);
  $(".user").removeClass('background-color-yellow');
  $('.addMatchConfirmation').hide();
}

Template.main.events({
  "click .addMatchConfirmation": function(e){
    e.preventDefault();
    var firstPlayer = Session.get('firstPlayer');
    var firstPlayerId = Session.get('firstPlayerId');
    var secondPlayer = Session.get("selectedPlayer");
    var secondPlayerId = Session.get('selectedPlayerId');
    Meteor.call("addSingleMatch", firstPlayer, firstPlayerId, secondPlayer, secondPlayerId);
    $.scrollTo($('.firstPlayer:first-child'), 1000);
  },
  "click .addMatch" : function(e) {
    e.preventDefault();
    Session.setDefault('firstPlayer', Meteor.user().services.facebook.first_name);
    Session.setDefault('firstPlayerId', Meteor.user().services.facebook.id);
    var $this = $(e.target);
    Session.set("firstPlayerId", Meteor.user().services.facebook.id);
    //store userName on Session
    Session.set('myNameis', Meteor.user().services.facebook.first_name);
    //prevent self selection
    if (Session.get('firstPlayerId') !== this.services.facebook.id){
      // SINGLE MODE
      if (Session.get('gameMode') === 'single') {
        //prevent multiple player selection
          Session.set("selectedPlayer", this.services.facebook.first_name);
          Session.set("selectedPlayerId", this.services.facebook.id);
          $('.selected').removeClass('selected');
          $this.parent().addClass('selected');
      }

      // DOUBLE MODE
      if (Session.get('gameMode') === 'double') {

        if ( !Session.get('selectedPlayer' ) ) {
          //select partner
          if ( Session.get('partnerPlayer') ) {
            Session.set('selectedPlayer', this.services.facebook.first_name);
            Session.set('selectedPlayerId', this.services.facebook.id)
            $this.parent().addClass('enemy');

          } else {
            Session.set('partnerPlayer', this.services.facebook.first_name);
            Session.set('partnerPlayerId', this.services.facebook.id);
            $this.parent().addClass('friend');
          }
          return false;
        }

        if (Session.get('partnerPlayer') && Session.get('selectedPlayer') ) {
          Session.set('selectedPlayerPartner', this.services.facebook.first_name);
          Session.set('selectedPlayerPartnerId', this.services.facebook.id);
          $this.parent().addClass('enemy');
          $('.addCoupleGame').css('display', 'block');
          $('.addMatch').hide();
          $('.singleMode').hide();
          return false;
        }
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
  },
  "click .addCoupleGame": function(e) {
    e.preventDefault();
    var firstPlayer = Meteor.user().services.facebook.first_name;
    var firstPlayerId = Session.get('firstPlayerId');
    var secondPlayer = Session.get("selectedPlayer");
    var secondPlayerId = Session.get('selectedPlayerId');
    var partnerPlayer = Session.get('partnerPlayer');
    var partnerPlayerId = Session.get('partnerPlayerId');
    var selectedPlayerPartner = Session.get('selectedPlayerPartner');
    var selectedPlayerPartnerId = Session.get('selectedPlayerPartnerId');
    Meteor.call("addMatch", firstPlayer, firstPlayerId, partnerPlayer, partnerPlayerId, secondPlayer, secondPlayerId, selectedPlayerPartner, selectedPlayerPartnerId);
    $.scrollTo($('.firstPlayer:first-child'), 1000);
  }
})