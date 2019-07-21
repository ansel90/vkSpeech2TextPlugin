const uri = `https://api.wit.ai/speech`;
const apikey = 'V6TZM46JC4GEZNUNS5ODWV42CUKAEXK5';

function start() {
	if (!checkLocation()) {
		return;
	}
	var messeages = toArray(getAudioMesseages());
	messeages.forEach(function(el) {
		insertVoice2TextButton(el);
	});
}

start();

setInterval(start, 1000);

function checkLocation() {
	var loc = String(window.location);

	if (loc.search(/vk[.]com/ui) == -1 || loc.search(/sel[=]/ui) == -1) // Проверка на нахождение в диалоге
	{
		return false;
	}
	return true;
}

function getAudioMesseages() {
	return document.getElementsByClassName("im_msg_media_audiomsg");
}

function insertVoice2TextButton(el) {
	if (buttonExists(el)) {
		return;
	}
	var button = document.createElement('button');
	button.type = "button";
	button.innerHTML = "Перевести в текст";
	button.onclick = function() {
		var audioUrl = this.previousElementSibling.firstElementChild.dataset.mp3;
		GetAudioBinary(audioUrl, this);
	}
	el.appendChild(button);
	el.classList.add("hasButton");
}

function buttonExists(el) {
	try {
		if (el.classList.contains("hasButton")) {
			return true;
		}
	}
	catch (err) {
		return true;
	}
	return false;
}

function toArray(obj) {
  var array = [];
  // iterate backwards ensuring that length is an UInt32
  for (var i = obj.length >>> 0; i--;) { 
    array[i] = obj[i];
  }
  return array;
}

function GetAudioBinary(audioUrl, el) {
	var http = new XMLHttpRequest();
	http.open('GET', audioUrl, true);

	http.responseType = 'blob';

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {
	        SendAudio(http.response, el);
	    }
	}
	http.send();
}

function SendAudio(httpbody, el) {
	fetch('https://api.wit.ai/speech', {
		method: 'POST',
		mode: 'cors',
		headers: {
            'Content-Type': 'audio/mpeg3',
            'Authorization': 'Bearer ' + apikey,
            'Accept': 'audio/x-mpeg-3',
            'Transfer-Encoding': 'chunked',
        },
        body: httpbody,
	})
  	.then(function(response) {
    	return response.json();
   	})
  	.then(function(response) {
   		var text = document.createElement('p');
   		text.innerHTML = response._text;
   		el.parentElement.appendChild(text);
  	})
  	.catch(alert);
}

//user = String(window.location);
//user = user.replace(/https:[/][/]soundcloud[.]com[/]/ui, '');
//user = user.replace(/[/].*/ui, '');

//var xhr = new XMLHttpRequest();
//xhr.open('GET', 'https://api.soundcloud.com/users/' + user + '?client_id=rZY6FYrMpGVhVDfaKEHdCaY8ALekxd8P');
//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//xhr.onload = function (){
//	subscribers = this.responseText;
//	user = JSON.parse(subscribers);
//	getFollowers();
//}
//xhr.send();


/*
<div class="">
    <button type="button">Текст</button>
</div>

class="im_msg_media im_msg_media_audiomsg"
*/