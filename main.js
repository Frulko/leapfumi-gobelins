var socket;
var isPlay = false;
$(document).ready(function(){
	            socket = io.connect(document.location.href);
	            var data = {};

	           	socket.emit("newClient", {name: player});
                socket.on("response", function(data){
                	console.log(data);
               	
                	if(player == "red"){
                		setHand2(currentFigure);
	                	setHand1(data.blue);
                	}else{
	                	setHand2(data.red);
	                	setHand1(currentFigure);
                	}
                				
			
					$('#pop-end span').html(data.winner+" gagne !");
					$('#pop-end').show();
					$('#overlay').show();
                	
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
			if(player == "red"){
        		setHand2(currentFigure);
        	}else{
            	setHand1(currentFigure);
        	}
			socket.emit("sendLeap", {player: player, sign: currentFigure});
			isPlay = false;
		});
		
		
		// Setup Leap loop with frame callback function
		var controllerOptions = {
			enableGestures: true
		};
		
		Leap.loop(controllerOptions, function(frame) {
			var gesture = frame.gestures;
			
			if(gesture.length > 0 && gesture[0].type == "circle" && gesture[0].state == "stop"){
				 console.log("start");
				 if(!isPlay){
				 	  $('#overlay').hide();
					  $(document).trigger('start');
					  $('#pop-welcome').hide();
				 	isPlay = true;
				 }
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
				
		//Détecte si la fenêtre a le focus :
		//Cela permet d'éviter de surcharger le leap de calculs inutiles
		$(window).focus(function() {
			isWindowFocused = true;
		});
		
		$(window).blur(function() {
			isWindowFocused = false;
		});