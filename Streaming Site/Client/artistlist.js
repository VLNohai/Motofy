const myToken = document.cookie;
const request = new XMLHttpRequest();
const searchbar = document.getElementById('search');
let pages = document.getElementById('pages');
let currentBoxes = [];

request.open('POST', '/query');
request.send('artists search  ' + myToken);
request.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        if(request.status == 200){
            currentBoxes = [];
            if(request.response.length != 0)
            {
                let artists = request.response.split('|');
                artists.forEach(artist => {
                    let artistdata = artist.split("%");
                    currentBoxes.push([artistdata[0], artistdata[1], artistdata[2]]);
                });
                pages.innerHTML = "";
                for(let i=0; i<Math.floor(currentBoxes.length/12) + 1; i++)
                {
                    let pagediv = document.createElement('div');
                    pagediv.setAttribute('onclick', 'showPage(' + (i + 1) + ')');
                    pagediv.textContent = (i + 1 + "|");
                    pages.appendChild(pagediv);
                }
            }
            showPage(1);
        }
    }
});

function makePretty(word)
{
    word = word.replaceAll('-', ' - ')
    word = word.replaceAll('_', ' ');
    return word;
}

function showPage(pagenumber)
{
    eraseAllBoxes();
    for(let i=(pagenumber-1)*12; i<Math.min(pagenumber*12, currentBoxes.length); i++)
    {
        let name = currentBoxes[i][0];
        let id = currentBoxes[i][1];
        let url = currentBoxes[i][2];
        addArtistUI(name, id, url);
    }
}

function eraseAllBoxes()
{
    let boxes = document.getElementsByClassName('songbox');
    while(boxes.length > 0)
    {
        boxes[0].remove();
    }
}

function spacesToUnderscores(word)
{
    ret = word.replaceAll(" ", "_");
    return ret;
}

function search()
{
    request.open('POST', '/query');
    request.send('artists search ' + spacesToUnderscores(searchbar.value));
}

function addArtistUI(artistname, artistid, photoPath)
{
    let songbox = document.createElement('div');

    let image = document.createElement('img');
    image.setAttribute('src', photoPath)
    image.setAttribute("height", "170");
    image.setAttribute("width", "200");
    image.setAttribute('class', 'artistPhoto');

    songbox.innerHTML = makePretty(artistname) + "<br>";
    songbox.appendChild(image);
    songbox.setAttribute('onclick', 'clickedArtist(' + "'" + artistid + "'" + ')');
    songbox.setAttribute('class', 'songbox');

    let row = document.getElementById('boxgrid');
    row.appendChild(songbox);
}

function clickedArtist(artistid)
{
    console.log(artistid);
    window.location.assign('http://localhost:3000/artist?' + artistid);
}