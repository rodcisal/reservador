Games = new Meteor.Collection("games");

Meteor.publish("users", function(){
  return Meteor.users.find();
});

Meteor.publish("gamesList", function(){
  return Games.find({}, {sort: {date: -1 }, limit: 10 });
});


Meteor.methods({
  addSingleMatch: function(firstPlayer, firstPlayerId, secondPlayer, secondPlayerId) {
      Games.insert({
        "firstPlayer": firstPlayer,
        "firstPlayerId": firstPlayerId,
        "secondPlayer": secondPlayer,
        "secondPlayerId": secondPlayerId,
        "date": new Date(),
        "state": true,
        "type": "single"
      });
  },
  addMatch: function(firstPlayer, firstPlayerId, partnerPlayer, partnerPlayerId, secondPlayer, secondPlayerId, selectedPlayerPartner, selectedPlayerPartnerId) {
    Games.insert({
      "firstPlayer": firstPlayer,
      "firstPlayerId": firstPlayerId,
      "partnerPlayer": partnerPlayer,
      "partnerPlayerId": partnerPlayerId,
      "secondPlayer": secondPlayer,
      "secondPlayerId": secondPlayerId,
      "selectedPlayerPartner": selectedPlayerPartner,
      "selectedPlayerPartnerId": selectedPlayerPartnerId,
      "date": new Date(),
      "state": true,
      "type": "double"
    });
  },
  endMatch: function(gameId){
    Games.update(gameId, {$set: {state: false}});
  }
});

