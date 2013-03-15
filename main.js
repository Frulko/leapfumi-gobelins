$(document).ready(function(){
	            socket = io.connect("http://localhost:8080");
	            var data = {};

	           	socket.emit("newClient", {name: player});
                socket.on("response", function(data){
                	console.log(data);
                	$("#result").html("WINNER : "+data.winner);
                	$('#adverse').html("BLUE : "+data.red);
                });
               
               
               $('#send').on("click",function(){
	               $(document).trigger('start');
               });
            });
            
            
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
			checkSign(currentFigure);
			socket.emit("sendLeap", {player: player, sign: currentFigure});
		});
		
		
		// Setup Leap loop with frame callback function
		var controllerOptions = {
			enableGestures: true
		};
		
		Leap.loop(controllerOptions, function(frame) {
			var gesture = frame.gestures;
			
			if(gesture.length > 0 && gesture[0].type == "circle" && gesture[0].state == "stop"){
				 
				 $(document).trigger('start');
			}
			
			if(isWindowFocused && gameIsRunning)
			{
				for (var i = 0; i < frame.pointables.length; i++) 
				{
					var fingers = frame.pointables;
		
					currentFigure = check(fingers);
					//console.log(currentFigure);
		
					//@TODO : afficher l'état courrant, refresh à chaque frame
				}
			}
		});
	
	
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
		
		 function checkSign(sign){
	               $("#own").html("You : "+sign);
	               $('#result').html("wait ...");
               }
				
		//Détecte si la fenêtre a le focus :
		//Cela permet d'éviter de surcharger le leap de calculs inutiles
		$(window).focus(function() {
			isWindowFocused = true;
		});
		
		$(window).blur(function() {
			isWindowFocused = false;
		});