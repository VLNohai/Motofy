const request = new XMLHttpRequest();

request.open('GET', '/query', true);

request.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        if(request.status == 200){
            tokens = request.responseText.split(' ');
            if(tokens[0] + " " + tokens[1] == "login succes")
            {
                localStorage.setItem('IDTOKEN', tokens[2]);
                window.location.assign('http://localhost:3000/home');
            }
            else
            if(request.responseText == "login failed")
            {
                window.alert("Login Failed");
            }
            else
            if(request.responseText == "register succes")
            {
                window.location.assign('http://localhost:3000/home');
            }
            else
            if(request.responseText == "register failed")
            {
                window.alert("Account is not valid");
            }
        }
        else{
            console.error(request.statusText)
        }
    }
});

function validate(){
    var username = document.getElementById('Username').value;
    var password = document.getElementById('Password').value;
    request.open('POST', '/query');
    request.send('login ' + username + ' ' + password);
}

function registerUser(){
    var username = document.getElementById('Username').value;
    var password = document.getElementById('Password').value;
    var repassword = document.getElementById('RePassword').value;
    if(password == repassword)
    {
        if(username.length >= 6 || username.length >= 6)
        {
            request.open('POST', '/query');
            request.send('register ' + username + ' ' + password);
        }
        else
        {
            alert("credentials must have 6 at least 6 characters");
        }
    }
    else
    {
        alert("passwords must match");
    }
}

function goToRegister(){
    console.log("tried to register");
    window.location.assign('http://localhost:3000/register');
}