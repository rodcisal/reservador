Games = new Meteor.Collection("games");

Meteor.publish("users", function(){
  return Meteor.users.find();
});

Meteor.publish("gamesList", function(){
  return Games.find({}, {sort: {date: -1 }, limit: 10 });
});


Meteor.methods({
  addMatch: function(firstPlayer, firstPlayerId, secondPlayer, secondPlayerId, state) {
    Games.insert({
      "firstPlayer": firstPlayer,
      "firstPlayerId": firstPlayerId,
      "secondPlayer": secondPlayer,
      "secondPlayerId": secondPlayerId,
      "date": new Date(),
      "state": true
    });
  },
  endMatch: function(gameId){
    Games.update(gameId, {$set: {state: false}});
  }
});

