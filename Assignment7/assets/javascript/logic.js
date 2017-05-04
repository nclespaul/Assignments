/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the next arrival time for each train and how many minutes
//    away each train is using Moment.js. 

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAfxS90SsOKxwDcm7kdMBUb1QMu-259Zjc",
    authDomain: "train-scheduler-d75e1.firebaseapp.com",
    databaseURL: "https://train-scheduler-d75e1.firebaseio.com",
    projectId: "train-scheduler-d75e1",
    storageBucket: "train-scheduler-d75e1.appspot.com",
    messagingSenderId: "197741954482"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(), "hmm").format("HH:mm");
  var trainRate = $("#rate-input").val().trim();
  trainRate = parseInt(trainRate);

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    rate: trainRate
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.rate);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#rate-input").val("");

  // Prevents moving to new page
  return false;
});

// 3. Create Firebase event for adding a train to the database and a row 
//    in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainRate = childSnapshot.val().rate;

  // Train Info
  console.log("trainName: ",trainName);
  console.log("trainDestination: ",trainDestination);
  console.log("trainStart: ",trainStart);
  console.log("trainRate: ", trainRate);

  // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(trainStart, "hh:mm").subtract(1, "years");
    console.log("firstTimeConverted: ", firstTimeConverted);

  // Calculate the current time.
  var currentTime = moment();
  console.log("Current Time: " + moment(currentTime).format("hh:mm"));

  // Calculate the difference between the first train time and current time.
  var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("Time Difference: ", timeDifference);

  //Calculate the 
  var timeRemaining = timeDifference % trainRate;
  console.log("Time Remaining: ", timeRemaining);

  // Calculate the 
  var minutesAway = trainRate - timeRemaining;
  console.log("Minutes Away: ", minutesAway);

  // Calculate the arrival time of the next train.
  var arrivalTime = moment().add(minutesAway, "minutes");
  var trainGetsHere = moment(arrivalTime).format("hh:mm A")
  console.log("Train Gets Here at: " + trainGetsHere);

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainRate + "</td><td>" + trainGetsHere + "</td><td>" + minutesAway + "</td></tr>");
});
