/* SCHEMA

Meteor.users : [
  user1 : {
    "username" : str,
    "password" : str,
    "profile" : {
      "lastUpdate" : int,
      "code" : str,
      "active" : boolean
    }
  }
]

tasks : [
  task1 : {
    "title" : str,
    "hash" : str,
    "topic" : str,
    "icon" : str,
    "points" : int,
    "day" : int,
    "allowed" : str[]
  },
  ...
]

scores : [
  score1 : {
    "team_scores" : [
      {
        "time" : int,
        "score" : int
      },
      ...
    ],
    "team_username" : str
  },
  ...
]

teams : [
  team1 : {
    "username" : str,
    "active" : boolean,
    "id" str
  },
  ...
]

settings : [
  setting1: {
    "option" : str,
    "setting" : int
  },
  ...
]

scoresarchive : [

]

backups : [
  backup1 : {
    "scores" : scores[],
    "scoreArchive" : scoresarchive[],
    "settings" : settings[],
    "tasks" : tasks[],
    "teams" : teams[],
    "date" : int
  },
  ...
]

registrationcodes : [
  registrationcode1 : {
    "code" : str,
    "used" : boolean,
    "role" : str
  }
]

trainingregistrationcodes : [
  registrationcode1 : {
    "code" : str,
    "used" : boolean,
    "mentorId" : str
  }
]


*/