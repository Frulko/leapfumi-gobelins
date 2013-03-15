
//Init
var isWindowFocused = true;
var gameIsRunning = false;
var currentFigure = null;


//Start event
$(document).on('start', function(){

	if(isWindowFocused)
	{
		gameIsRunning = true;
		var cpt = 3;

		//Reset de currentFigure
		currentFigure = null;

		var interval = setInterval(function(){
			//Affichage du compte à rebours
			$('#cpt').html(cpt);

			cpt--;
		}, 1000);

		setTimeout(function(){
			gameIsRunning = false;
			clearInterval(interval);

			$(document).trigger('endGame');
			$('#cpt').html("");
		}, 4000);
	}
});

//EndGame event
$(document).on('endGame', function(){

	console.log('Signe choisi : ' + currentFigure);
	console.log('win : ' + compareResults(currentFigure, 'rock'));
	setHand1(currentFigure);
	setHand2('rock');
	$('#pop-end span').html("C'EST LA WIN");
	$('#pop-end').show();
	$('#overlay').show();
});


// Setup Leap loop with frame callback function
var controllerOptions = {
	enableGestures: true
};

/*Leap.loop(controllerOptions, function(frame) {

	if(isWindowFocused && gameIsRunning)
	{
		for (var i = 0; i < frame.pointables.length; i++) 
		{
			var fingers = frame.pointables;

			currentFigure = check(fingers);
			//console.log(currentFigure);

			setHand1(currentFigure);
			//Si joueur 2 :
			//setHand2(currentFigure);
		}
	}
});
*/

//Affiche la bonne main 1
function setHand1(figure){

	$('.main1').css('visibility', 'hidden');
	$('#main1'+figure).css('visibility', 'visible');
}

//Affiche la bonne main 2
function setHand2(figure){

	$('.main2').css('visibility', 'hidden');
	$('#main2'+figure).css('visibility', 'visible');
}

//Renvoie le signe effectué par l'utilisateur
function check(fingers){

	var result = 'rock';

	if(fingers.length >= 3)
	{
		result = 'paper';
	}
	else if(fingers.length > 1)
	{
		result = 'scissors';
	}

	return result;
}


//Compare le score du joueur avec celui du joueur adverse
//Renvoie win = true, false ou null
function compareResults(result1, result2){

	var win = null;

	if(result1 == "scissors" && result2 == "paper")
		win = true;
	else if(result1 == "scissors" && result2 == "rock")
		win = false;
	else if(result1 == "paper" && result2 == "rock")
		win = true;
	else if(result1 == "paper" && result2 == "scissors")
		win = false;
	else if(result1 == "rock" && result2 == "scissors")
		win = true;
	else if(result1 == "rock" && result2 == "paper")
		win = false;
	else if(result1 != null && result2 == null)
		win = true;
	else if(result1 == null && result2 != null)
		win = false;
	else if(result1 == result2)
		win = null;

	return win;
}


//Détecte si la fenêtre a le focus :
//Cela permet d'éviter de surcharger le leap de calculs inutiles
$(window).focus(function() {
	isWindowFocused = true;
});

$(window).blur(function() {
	isWindowFocused = false;
});
