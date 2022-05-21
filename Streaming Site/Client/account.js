let profilepicture = document.getElementById('profilepicture');
const usernamebox = document.getElementById('usernamebox');
const cookies = document.cookie.split(' ');
const userToken = cookies[cookies.length - 1];
const request = new XMLHttpRequest();

request.open('POST', '/query');
request.send('profile ' + userToken);

const handleImageUpload = event => {
    console.log('triggered');
    const files = event.target.files
    const formData = new FormData()
    formData.append('myFile', files[0])
  
    fetch('/saveImage', {
      method: 'POST',
      body: formData
    })
}

document.querySelector('#fileUpload').addEventListener('change', event => {
    handleImageUpload(event)
  })

request.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        if(request.status == 200){
            if(request.response == 'Not_logged_in'){
                window.location.assign('http://localhost:3000/login');
                return;
            }
            let tokens = request.response.split(' ');
            usernamebox.textContent = tokens[0];
            profilepicture.setAttribute('src', tokens[1]);
        }
    }
});