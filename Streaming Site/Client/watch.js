let cookies = document.cookie.split(' ');
const userToken = cookies[cookies.length - 1];
let playing = false;
let streaming = false;
var context;
var gainNode;
var reverbGain;
var playSound;
var mp3URL;
var songName;
var artistName;
var albumName;
let songduration = 0;
let playbackSpeed = 1.0;
let playButton = document.getElementById('play');
let timeline = document.getElementById('timeline');
let timeStamp = document.getElementById('timeStamp');
let volumeKnob = document.getElementById('volume');
let playbackKnob = document.getElementById('playback');
let title = document.getElementById('title');
let cover = document.getElementById('cover');
let linkButton = document.getElementById('linkbtn');
let linkBox = document.getElementById('linkbox');

const request = new XMLHttpRequest();
request.open('POST', '/query');
request.send('song ' + window.location.href.split('?')[1]  + ' ' + userToken);
console.log('song ' + window.location.href.split('?')[1]  + ' ' + userToken);
request.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        if(request.status == 200){
            if(request.response.split(' ')[0] == "roomid"){
                console.log(linkBox);
                linkBox.value = "localhost:3000/shared?" + request.response.split(' ')[1];
            }
            else
            {
                let tokens = request.response.split('%');

                songName = tokens[0];
                artistName = tokens[1];
                albumName = tokens[2];
                albumPhoto = tokens[3];
                console.log(albumPhoto);
                songduration = parseInt(tokens[4]);
                mp3URL = "Resources/Songs/" + artistName + '/' + albumName  + '/' + songName + '.mp3';
                console.log(mp3URL);
                title.textContent = artistName + " - " + songName + ' (From ' + albumName + ')';
                cover.setAttribute('src', albumPhoto);

                timeline.max = songduration + 1;
                timeStamp.textContent = timeStamp.textContent + " - " + formatTimeStamp("" + songduration);
                playButton.disabled = false;
            }
        }
    }
})

async function hostRoom(){

}

function shareRoom(){
    request.open('POST', '/query');
    request.send('room ' + window.location.href.split('?')[1]  + ' ' + userToken);
    linkButton.disabled = true;
}

async function createReverb() {
    let convolver = context.createConvolver();

    // load impulse response from file
    let response     = await fetch("Resources/IR.wav");
    let arraybuffer  = await response.arrayBuffer();
    convolver.buffer = await context.decodeAudioData(arraybuffer);

    return convolver;
}

function formatTimeStamp(raw)
{
    var seconds = Math.floor(parseInt(raw) % 60); 
    var minutes = Math.floor(parseInt(raw) / 60);
    if(seconds < 10) seconds = "0" + seconds;
    else seconds = "" + seconds;
    minutes = "" + minutes;
    return minutes + ":" + seconds;
}

function updateStamp()
{
    timeStamp.textContent = formatTimeStamp(Math.floor(timeline.value)) + " - " + formatTimeStamp("" + songduration);
}

function updateVolume()
{
    gainNode.gain.value = volumeKnob.value;
}

function updateSpeed()
{
    playSound.playbackRate.value = playbackKnob.value;
    playbackSpeed = parseFloat(playbackKnob.value);
}

function runTimer() {
    if(playing == true && streaming == true)
    {
        timeline.value = (parseInt(timeline.value) + 1);
        if(parseInt(timeline.value) > songduration)
        {
            Pause();
            playButton.textContent = 'Replay';
        }
        else
            updateStamp();
    }
 }
 setInterval(runTimer, 1000);

async function setupContext(audio, context)
{
    let reverb = await createReverb();
    reverb.connect(context.destination);

    playSound = context.createBufferSource();

    gainNode = context.createGain();
    gainNode.gain.value = 1;
    gainNode.connect(context.destination);

    reverbGain = context.createGain();
    reverbGain.gain.value = 4;
    reverb.connect(reverbGain);

    playSound.buffer = audio;
    playSound.connect(context.destination);
    playSound.connect(gainNode);
    playSound.connect(reverb);
    playSound.start(context.currentTime);
}

function PlayButtonPressed()
{
    if(!streaming)
    {
        BeginStream();
        streaming = true;
        playing = true;
        return;
    }
    if(!playing)
    {
        if(parseInt(timeline.value) > songduration)
        {
            timeline.value = 0;
            InputResume();
        }
        Resume();
        return;
    }
    Pause();
}

function Resume()
{
    playing = true;
    playButton.textContent = 'Stop';
    context.resume();
}

function Pause()
{
    playing = false;
    playButton.textContent = 'Play';
    context.suspend();
}

function InputPause()
{
    context.suspend();
}

function InputResume()
{
    temp = playSound.buffer;
    playSound.stop(context.currentTime);
    playSound.disconnect();
    playSound = context.createBufferSource();
    playSound.buffer = temp;
    playSound.connect(context.destination);
    playSound.connect(gainNode);
    playSound.start(context.currentTime, parseInt(timeline.value));
    playSound.playbackRate.value = playbackSpeed;
    if(playing == true)
    {
        context.resume();
    }
}

function BeginStream()
{
    context = new AudioContext();
    timeline.disabled = false;
    Resume();
    fetch(mp3URL)
    .then(data => data.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(decodedAudio => (
        setupContext(decodedAudio, context)
    ))
}