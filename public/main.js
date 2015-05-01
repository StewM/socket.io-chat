$(function() {
var FADE_TIME = 150; // ms

// Initialize varibles
var $window = $(window);
var $usernameInput = $('.usernameInput'); // Input for username
var $messages = $('.messages'); // Messages area
var $inputMessage = $('.inputMessage'); // Input message input box

var $loginPage = $('.login.page'); // The login page
var $chatPage = $('.chat.page'); // The chatroom 

$('<audio id="chatAudio"><source src="notification.wav" type="audio/wav"></audio>').appendTo('body');
$('<audio id="loginAudio"><source src="login.wav" type="audio/wav"></audio>').appendTo('body');
$('<audio id="logoutAudio"><source src="logout.wav" type="audio/wav"></audio>').appendTo('body');

// Prompt for setting a username
var username;
var connected = false;
var $currentInput = $usernameInput.focus();

var socket = io();

function setUsername() {
  username = cleanInput($usernameInput.val().trim());

  if (username){
    $loginPage.fadeOut();
    $chatPage.show();
    $loginPage.off('click');
    $currentInput = $inputMessage.focus();

    socket.emit('add user', username);
  }
}

function sendMessage (){
  var message = $inputMessage.val();

  message = cleanInput(message);

  if (message && connected) {
    socket.emit('chat message', message);
    $inputMessage.val('');
    var $usernameDiv = $('<span class="username"/>')
      .text(username);
  var $messageBodyDiv = $('<span class="messageBody">')
    .text(message);
  var $messageDiv = $('<li class="message"/>')
    .data('username', username)
    .append($usernameDiv, $messageBodyDiv);
    $('.messages').append($messageDiv);
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }
}

// Prevents input from having injected markup
function cleanInput (input) {
  return $('<div/>').text(input).text();
}

// Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
      } else {
        setUsername();
      }
    }
  });

// Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

// Socket Events

socket.on('login', function() {
  connected = true;
});

socket.on('user joined', function(name){
  $('.messages').append($('<li class="message" />').text(name + ' joined the chat'));
  $('#loginAudio')[0].play();
   $messages[0].scrollTop = $messages[0].scrollHeight;
});

socket.on('user left', function(name){
  $('.messages').append($('<li class="message" />').text(name + ' left the chat'));
  $('#logoutAudio')[0].play();
   $messages[0].scrollTop = $messages[0].scrollHeight;
});
  
socket.on('chat message', function(data){
  var $usernameDiv = $('<span class="username"/>')
      .text(data.username);
  var $messageBodyDiv = $('<span class="messageBody">')
    .text(data.message);
  var $messageDiv = $('<li class="message"/>')
    .data('username', data.username)
    .append($usernameDiv, $messageBodyDiv);
  $('.messages').append($messageDiv);
  if (!document.hasFocus()){
    $('#chatAudio')[0].play();
  };
   $messages[0].scrollTop = $messages[0].scrollHeight;
});

});