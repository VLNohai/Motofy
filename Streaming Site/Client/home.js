let myToken = localStorage.getItem('IDTOKEN')
console.log(myToken)

let csslink = document.getElementById('csssource');
csslink.href = 'home.css%' + myToken;