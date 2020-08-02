const button = document.getElementById('button');
const audio = document.getElementById('audioElement');
const jokeText = document.getElementById('joketext');
const twitterBtn = document.getElementById('twitter-button');

// URL to the Joke API
const jokeUrl = 'https://sv443.net/jokeapi/v2/joke/Programming?blacklistFlags=racist,sexist'

// VoiceRSS Javascript SDK
const VoiceRSS={speech:function(e){this._validate(e),this._request(e)},_validate:function(e){if(!e)throw"The settings are undefined";if(!e.key)throw"The API key is undefined";if(!e.src)throw"The text is undefined";if(!e.hl)throw"The language is undefined";if(e.c&&"auto"!=e.c.toLowerCase()){var a=!1;switch(e.c.toLowerCase()){case"mp3":a=(new Audio).canPlayType("audio/mpeg").replace("no","");break;case"wav":a=(new Audio).canPlayType("audio/wav").replace("no","");break;case"aac":a=(new Audio).canPlayType("audio/aac").replace("no","");break;case"ogg":a=(new Audio).canPlayType("audio/ogg").replace("no","");break;case"caf":a=(new Audio).canPlayType("audio/x-caf").replace("no","")}if(!a)throw"The browser does not support the audio codec "+e.c}},_request:function(e){var a=this._buildRequest(e),t=this._getXHR();t.onreadystatechange=function(){if(4==t.readyState&&200==t.status){if(0==t.responseText.indexOf("ERROR"))throw t.responseText;audioElement.src=t.responseText,audioElement.play()}},t.open("POST","https://api.voicerss.org/",!0),t.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),t.send(a)},_buildRequest:function(e){var a=e.c&&"auto"!=e.c.toLowerCase()?e.c:this._detectCodec();return"key="+(e.key||"")+"&src="+(e.src||"")+"&hl="+(e.hl||"")+"&r="+(e.r||"")+"&c="+(a||"")+"&f="+(e.f||"")+"&ssml="+(e.ssml||"")+"&b64=true"},_detectCodec:function(){var e=new Audio;return e.canPlayType("audio/mpeg").replace("no","")?"mp3":e.canPlayType("audio/wav").replace("no","")?"wav":e.canPlayType("audio/aac").replace("no","")?"aac":e.canPlayType("audio/ogg").replace("no","")?"ogg":e.canPlayType("audio/x-caf").replace("no","")?"caf":""},_getXHR:function(){try{return new XMLHttpRequest}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}throw"The browser does not support HTTP request"}};

// Enable/disable the button
function toggleButton() {
    button.disabled = !button.disabled;
}

// Send our text to VoiceRSS to create the audio element
function speak(words) {
    VoiceRSS.speech({
        key: '34c5c2a34d6f478a95e31e5b00494c16',
        src: words,
        hl: 'en-us',
        v: 'Linda',
        r: 0, 
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
}

// Get a joke from the JokeAPI
async function getJoke() {
    let joke = '';
    try {
        const response = await fetch(jokeUrl);
        const data = await response.json();
        
        if(data.type === 'twopart') {
            joke = `${data.setup} ... ${data.delivery}`;
        }

        else {
            joke = data.joke;
        }

        if (joke.length >= 300) {
            jokeText.classList.add('long-joke');
        }
        else {
            jokeText.classList.remove('long-joke');
        }

    } catch(error) {
        //Could not get a joke :(
        console.log('No joke found', error);
        joke = 'I\'m sorry, my programmer messed something up. My sad copter goes soi soi soi soi soi soi soi soi soi soi sad face'
    }

    return joke;
}

// Get our joke from the Joke API and give it to VoiceRSS
async function prepJoke() {
    toggleButton();
    let joke = await getJoke();
    speak(joke);
    jokeText.textContent=joke;
    twitterBtn.hidden = false;
}

function tweetJoke() {
    const joke = jokeText.textContent;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${joke}`;
    window.open(twitterUrl, '_blank');
}

// Event listeners
button.addEventListener('click', prepJoke);
twitterBtn.addEventListener('click', tweetJoke);
audioElement.addEventListener('ended', toggleButton);