import * as dbinterface from './extra.js'; // or './module'

const express = require('express');

const app = express()

app.use(express.static(__dirname + '/public/static'))

app.get('/home', (req, res) => {
    try {
        let root_directory = __dirname + '/' + root + '/';
        res.sendFile(root_directory + 'home.html', root_directory);
    }catch(err) {
        console.log(err);
    }
  })

app.use(function(err, req, res, next) {
if(401 == err.status) {
    res.redirect('/home')
}
});
  

let port = 3000;
let root = "public";
app.listen(port, 'localhost', () => console.log(`Listening on port ${port}!`))
  
