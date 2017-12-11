/* Including all necessary modules */

const express=require("express");
const http =require("http");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs=require("fs");
const app=express(); // starting express app
const axios=require('axios');

const urlencodedParser=bodyParser.urlencoded({extended: false});
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

/* Displaying hello world */
app.get('/',(req,res)=>{
console.log(`In comes a request to: ${req.url}`);
res.end(`Hello world-Shivangi`);
});

/* fetching authors, posts and displaying number of posts by each author */
const users='https://jsonplaceholder.typicode.com/users';
const posts='https://jsonplaceholder.typicode.com/posts';

//Performing multiple concurrent requests using axios.all

//performing two API calls concurrently
function getUsers(){                 
	return axios.get(users);
}
function getPosts(){
	return axios.get(posts);
}


app.get('/authors',(req,res)=>{

axios.all([getUsers(),getPosts()])
// here users holds response of user and posts holds response of posts
.then(axios.spread((users,posts)=>{  
	//need an empty array for users to push items 
	name=[];             
	// calls user function once for each element in users array           
	users.data.forEach((user)=>{    
       name.push(user.name);
	});
	//need an empty array for posts to push items 
	 postsNum=[];                   
    posts.data.forEach((post)=>{
    // if userId=1 the post belongs to user 1 and so on	
    if(postsNum[post.userId -1]==null)   
    postsNum[post.userId-1]=1;     
    else
    postsNum[post.userId -1]+=1;
    });
    //displaying posts for each user
    for(let i=0;i<name.length;i++)  
    	res.write(`${i+1}) ${name[i]} has number of posts= ${postsNum[i]}\n`); 
res.end();
})).catch((error)=>              
{
res.status(500).send(`Error`); 
});

});

/* setting cookie: name,age */

app.get('/setcookie',(req, res)=>{ 
res.cookie('name', 'Shivangi');
res.cookie('age','19'); 
 res.status(200).send(`Cookie is set!`);  
});  

/*displaying stored cookie*/

app.get('/getcookies', (req, res)=> { 
res.status(200).send(req.cookies);     //If /getcookies is opened then cookies are displayed
});  

/* denying request to robots.txt */
app.get('/robots.txt',(req,res)=>{
res.status(403); //Http 403-Forbidden status
res.end();
});

/*showing an html page */
app.get('/html',(req,res)=>{
fs.readFile('htmlfile.html',(err,data)=>{
	res.writeHead(200,{'Content-Type': 'text/html'});
	res.write(data);
	res.end();
});
});

/* taking input in a form and displaying it */
app.get('/input',(req,res)=>{
res.sendFile(__dirname+"/"+"inputform.html");
});
  
app.post('/input',(req,res)=>{
res.send(`You just entered: ${JSON.parse(JSON.stringify(req.body.some_string))}`);
console.log(`Entered string: ${JSON.stringify(req.body.some_string)}`);
res.end();
});


/* Starting a server listening on port 8080 */
app.listen(8080,()=>{
console.log('Server started on port 8080');
	});