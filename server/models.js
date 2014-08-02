Games = new Meteor.Collection("games");

Meteor.publish("users", function(){
  return Meteor.users.find();
});

Meteor.publish("gamesList", function(){
  return Games.find();
});


Meteor.methods({
  addMatch: function() {
    Games.insert({
      "firstPlayer": firstPlayer,
      "secondPlayer": secondPlayer,
      "date": new Date(),
      "state": state
    });
  }
});

