
/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Hi! I'm Zuckerbot! Just  a simple, normal, chat bot."); //We start with the introduction;
    setTimeout(timedQuestion, 6000, socket, "Let's sign you up for my new project. What username would you like?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer =  input +'? '+ 'Oh... that\'s.. that\'s been taken already... haha :|'; // output response
    waitTime = 4000;
    question = 'Let\'s try this again. What OTHER username do you want?'; // load next question
    
  } else if (questionNum == 1) {
    answer =  "Really? "+ input +" it is, I guess";
	waitTime = 3000;
    setTimeout(timedAnswer, 2150, socket, "haha ok gimme your data");


    question = 'So where you from ' + input +'?';

  } else if (questionNum == 2) {
     answer = "Oh, I already knew that";
	waitTime = 2250;
     setTimeout(timedAnswer,1250, socket, "now");
     setTimeout(timedAnswer,1500, socket, "gimme");
     setTimeout(timedAnswer,1750, socket, "your");
     setTimeout(timedAnswer,2000, socket, "data");

	question = 'Is there anything thats on your mind that you just want to tell me?';
//	socket.emit('changeBG','blue');

  } else if (questionNum == 3) {
    answer = 'No, ' + input + ', that\'s not what you wanted to tell me >:(';
    waitTime = 2000;
    question = 'Like, really, just like, maybe the first password that comes to mind?'; // load next question
  } else if (questionNum == 4)  {
      answer = 'haha that\'s a good one';
      waitTime = 2750;
     setTimeout(timedAnswer,1250, socket, "what");
     setTimeout(timedAnswer,1500, socket, "about");
     setTimeout(timedAnswer,1750, socket, "your");
     setTimeout(timedAnswer,2000, socket, "other");
     setTimeout(timedAnswer,2250, socket, "data");
     setTimeout(timedAnswer,2500, socket, "hmmm?");

      question = 'haha yeah any last comments for me, a normal, regular bot?'; // load next question
     
    // load next question
  } else {
    answer = 'Hey it was nice talking to you '+ input+ '! you should come back again some time ;)'; // output response
    waitTime = 7000;
    question = '';
  }


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedAnswer, waitTime, socket, answer); 
 setTimeout(timedQuestion, waitTime, socket, question);
 
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
function timedAnswer(socket, answer){
	socket.emit('answer',answer);
}
function wait(ms){
	var start = new Date().getTime();
	var end = start;
	while(end<start+ms){
		end = new Date().getTime();
	}
}
//----------------------------------------------------------------------------//
