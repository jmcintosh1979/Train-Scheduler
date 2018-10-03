// Initialize Firebase
var config = {
  apiKey: "AIzaSyDp89D4FjGGgDMDvjbq6OtVoI2f6TnGH5c",
  authDomain: "train-scheduler2-86272.firebaseapp.com",
  databaseURL: "https://train-scheduler2-86272.firebaseio.com",
  projectId: "train-scheduler2-86272",
  storageBucket: "train-scheduler2-86272.appspot.com",
  messagingSenderId: "30779058501"
};

firebase.initializeApp(config);

// Variable for Firebase DataBase
var database = firebase.database();

// Button for adding Train to Schedule 
$("#add-train-btn").on("click", function(e) {
  e.preventDefault();

  var trainName = $("#train-name-input").val().trim(),
      destination = $("#destination-input").val().trim(),
      startTrain = moment($("#start-train-input").val().trim(), "HH:mm").format("HH:mm");
      frequency = $("#frequency-rate-input").val().trim(),
      
      // Train Object for adding to DB easier
      newTrain = {
        name: trainName,
        destination: destination, 
        firstTrain: startTrain,
        frequency: frequency
      };

  // Push New Train Information to the DB
  database.ref().push(newTrain);

  // console.log(newTrain.name);
  // console.log(newTrain.destination);
  // console.log(newTrain.firstTrain);
  // console.log(newTrain.frequency);

  // Clear Forms Input Values 
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-train-input").val("");
  $("#frequency-rate-input").val("");

});  // End "Add Train" Function


// After New Train is added, get New Train Info to display on page
database.ref().on("child_added", function(childSnapShot) {
  console.log(childSnapShot.val());

  var trainName = childSnapShot.val().name,
      destination = childSnapShot.val().destination,
      startTrain = childSnapShot.val().startTrain,
      frequency = childSnapShot.val().frequency;

  var convertedTime = moment(startTrain, "HH:mm").subtract(1, "years"),
      diffTime = moment().diff(moment(convertedTime), "minutes"),
      timeRemain = diffTime % frequency,
      minAway = frequency - timeRemain,
      nextTrain = moment().add(moment(minAway), "minutes").format("HH:mm");           
  
      console.log(convertedTime);
      console.log(diffTime);
      console.log(timeRemain);
      console.log(minAway);
      
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextTrain),
    $("<td>").text(minAway)
  );

  $("#train-table > tbody").append(newRow);
}); // End New Train Info to Display on Page
