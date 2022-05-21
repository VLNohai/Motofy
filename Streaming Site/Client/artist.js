const request = new XMLHttpRequest();
let title = document.getElementById('title');
let container = document.getElementById('frameofframes');

var artistname;

request.open('POST', '/query');
request.send('songs ' + window.location.href.split('?')[1]);

request.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        if(request.status == 200){
            let tokens = request.response.split('$');
            artistname = tokens[0];
            title.textContent = artistname;
            let songs = tokens[1].split('|');
            songs.forEach(song => {
                console.log(song);
                let tokens = song.split('%');
                showSong(tokens[0], tokens[1], tokens[2]);
            });
        }
    }
});

function showSong(songName, album, songID)
{
    let frame = document.getElementById(album);
    if(frame == null){
        frame = document.createElement('div');
        frame.setAttribute('class', 'frame')
        frame.setAttribute('id', album);
        frame.textContent = album;
        container.appendChild(frame);
    }

    let button = document.createElement('button');
    button.textContent = songName;
    button.setAttribute('onclick', 'onSongClicked(' + "'"+ songID +"'" + ')');
    button.setAttribute('class', 'center');
    frame.appendChild(button);
}

function onSongClicked(songID)
{
    window.location.assign('http://localhost:3000/watch?' + songID);
}