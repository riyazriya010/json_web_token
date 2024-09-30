require('dotenv').config()
const express = require('express');

const app = express();

const jwt = require('jsonwebtoken');

app.use(express.json());

const posts = [
    { username: 'Riyas', post: 'Post1' },
    { username: 'Yaseer', post: 'Post2' },
];

app.get('/posts', authenticateUser, (req, res) => {
    console.log(req.user.name)
    const filteredPosts = posts.filter(post => post.username === req.user.name);
    console.log('Filtered Posts:', filteredPosts);
    res.json(filteredPosts);
});

app.post('/login', (req, res) => {
    //Authenticate User

    const username = req.body.username
    const user = { name: username }

    const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN)
    res.json({ accessToken: accessToken })

});

// Authenticate Middleware
function authenticateUser(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
        if(err) return res.sendStatus(403);

        console.log('Authenticated User:', user); // Debugging line
        req.user = user
        next();
    });
}

app.listen(3002, (error) => {
    if(error) throw error
    console.log('Server is runngin on port 3000');
});