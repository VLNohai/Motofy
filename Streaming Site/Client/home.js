let cookies = document.cookie.split(' ');
let myToken = cookies[cookies.length - 1];
const boxrowartist = document.getElementById('boxrowartist');
const boxrowsongs = document.getElementById('boxrowsongs');
const boxrowhist = document.getElementById('boxrowhist');

const request = new XMLHttpRequest();

request.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        if(request.status == 200){
            let header = request.response.split(' ')[0];
            console.log(header);
            if(request.response.split(' ').length > 1){
            let items = request.response.split(' ')[1];
                switch(header){
                    case "artists": addItems(boxrowartist, items, 'clickedArtist'); break;
                    case "songs": addItems(boxrowsongs, items, 'clickedSong'); break;
                    case "hist": addItems(boxrowhist, items, 'clickedSong'); break; 
                }
            }
        }
    }
});

request.open('POST', '/query', false);
request.send('recommend artists ' + myToken);

request.open('POST', '/query', false);
request.send('recommend songs ' + myToken);

request.open('POST', '/query', false);
request.send('recommend hist ' + myToken);

function addItems(parent, items, functionName){
    let elements = items.split('|');
                elements.forEach(element => {
                    let elementData = element.split("%");
                    addUIBox(parent, elementData[0], elementData[1], elementData[2], functionName);
                });
}

function makePretty(word)
{
    word = word.replaceAll('-', ' - ')
    word = word.replaceAll('_', ' ');
    return word;
}

function addUIBox(parent, title, photoPath, ID, functionName)
{
    let songbox = document.createElement('div');

    let image = document.createElement('img');
    image.setAttribute('src', photoPath);
    image.setAttribute("height", "170");
    image.setAttribute("width", "200");
    image.setAttribute('class', 'artistPhoto');

    songbox.innerHTML = makePretty(title) + "<br>";
    songbox.appendChild(image);

    songbox.setAttribute('onclick', functionName + '(' + "'" + ID + "'" + ')');
    songbox.setAttribute('class', 'songbox');

    parent.appendChild(songbox);
}

function clickedArtist(artistID)
{
    window.location.assign('http://localhost:3000/artist?' + artistID);
}

function clickedSong(songID)
{
    window.location.assign('http://localhost:3000/watch?' + songID);
}