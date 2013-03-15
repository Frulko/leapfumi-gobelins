var fs = require('fs');
var path = require('path');
var app = require('http').createServer(function(req, res){

    var filePath = req.url;
    var test = filePath.substring(2);
    var regex = /id/;

    if (filePath == '/' || test.match(regex)) {
        filePath = '/index.html';
    }
    else{
        var patt1 = /\.([0-9a-z]+)/i;
        var m5 = filePath.match(patt1);
    }

    var extname = path.extname(filePath); //Gestion des extensions de fichier et changement du type MIME
    var contentTypesByExtention = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css':  'text/css'
    };
    var contentType = contentTypesByExtention[extname] || 'text/plain';


    fs.exists(__dirname+filePath, function(exists) {

        if (exists) {
            var html = require('fs').readFileSync(__dirname+filePath);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(html, 'utf-8');
        }
        else {
            res.writeHead(404);
            res.end("Erreur 404");
        }
    });
});
app.listen(8080);
                                                     
console.log("Lancement du serveur");                                                                    


var clients = {};
var groups = {};
var party = [];
//on lance socket.io et on écoute
var io = require("socket.io");
var io = io.listen(app,{ log: false }); //Lancement du serveur de socket et non affichage des logs



//Evenement de connection
io.sockets.on('connection', function (socket){
    socket.on('newClient', function(data){ //Reception d'un nouveau client
        //socket.broadcast.emit('connection_res', {"to":req.to,"type":req.type,"from":req.from});
        console.log('[ NEW ] '+data.name);
        //On ajoute le client au tableau en renseignant son pseudo et son statut (connecté ou non)
	    party[data.name] = "none";
	    
    });

    socket.on('newGroup', function(data){ //Reception d'un nouveau client
    	var i = data.idClient;
	    console.log('[ GROUP ] ['+data.idCurrent+'] to ['+clients[i].login+']');
	    groups[numGroups] =  { from: data.idCurrent, to: data.idClient, status:1};
	    numGroups ++;

    });

    socket.on('sendLeap', function(data){ //Reception d'un nouveau client
	    party[data.player] = data.sign;
	    
	    var result = checkSign(data.player);
	    if(result){
	    	socket.emit('response', result);
		    socket.broadcast.emit('response', result);
	    }
		
	    
        //socket.broadcast.emit('connection_success', {"to":res.to,"from":res.from,"connect":res.connect});

    });
    
    
});




function checkSign(player){
	
	var result = {};
	
	
	var own = player;
	var adverse;
	if( player == "blue" ){
		adverse = "red";
	}else{
		adverse = "blue";
	}
	
	
	
	if(party[own] != "none" && party[adverse] != "none"){
		result[own] = party[own];
		result[adverse] = party[adverse];

		if(party[own] == party[adverse]){
			result["winner"] = "nobody";
		}
		else if(party[own] == "rock" && party[adverse] == "scissor"){
			result["winner"] = own;
		}
		else if(party[own] == "scissor" && party[adverse] == "paper"){
			result["winner"] = own;
		}
		else if(party[own] == "paper" && party[adverse] == "rock"){
			result["winner"] = own;
		}
		else{
			 result["winner"] = adverse;
		}
	}else{
		return false;
	}
	return result;
}
//Pierre bat le ciseau
//Ciseau bat la feuille
//Feuille bat la pierre

/*var html = require('fs').readFileSync(__dirname+'/index.html');
var server = require('http').createServer(function(req, res){
    res.end(html);
});
server.listen(1337);
console.log("Serveur NodeJS for LEAP MOTION");
var nowjs = require("now");
var everyone = nowjs.initialize(server);
var clients = {}; // Attention ne pas initialiser avec [] car bug lors de la transmission de la variable au client

for(var i in clients) {
        console.log('['+i+'] -- '+clients[i]);
}

everyone.now.newClient = function(name, ifleap){
	console.log('- New client : '+name+' as a leap '+);
    //On ajoute le client au tableau en renseignant son pseudo et son statut (connecté ou non)
    clients[this.user.clientId] =  { login: name, statut: 1};
    // On met à jour la liste des connectés
    for(var c in clients) {
        nowjs.getClient(c, function(err) {
            this.now.updateClientList(clients);
        });
    }
};

everyone.now.openChat = function(idClient){
    var idChat = idClient+this.user.clientId;
    var newChat = nowjs.getGroup(idChat);
    newChat.addUser(this.user.clientId);
    newChat.addUser(idClient);
    newChat.now.addChat(idChat,idClient,clients[idClient].login,clients[this.user.clientId].login);
    
    console.log('- New group ['+idChat+'] : ['+clients[this.user.clientId].login+'] to ['+clients[idClient].login+']');
};

everyone.now.sendMessage = function(message, room){
    var group = nowjs.getGroup(room);
    var idSender = this.user.clientId;
    group.count(function (ct) {
        if(ct <= 1) group.now.displayMessage(room, "Your friend isn't connected");
        else group.now.displayMessage(room, clients[idSender].login+': '+clean(message));
    });
};

nowjs.on('disconnect', function() {
	
    for(var i in clients) {
        if(i == this.user.clientId) {
        	console.log('- Leave client : '+clients[i].login);
            delete clients[i];
            break;
        }
    }
    for(var i in clients) {
        nowjs.getClient(i, function(err) {
            this.now.updateClientList(clients);
        });
    }
});

function clean(html){
    return String(html).replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
*/