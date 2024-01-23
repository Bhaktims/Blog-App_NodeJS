const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


/** 
*GET/
*HOME
*/

//Routes
router.get('', async (req,res) => {
try{
    const locals = {
    title: "NodeJS Blog",
    description:"Simple Blog Created with NodeJS,Express & MongoDB"
  }

  let perPage = 5;
  let page = req.query.page || 1;

  const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
  .skip(perPage * page - perPage)
  .limit(perPage)
  .exec();

  const count = await Post.collection.count();
  const nextPage = parseInt(page) + 1;
  const hasNextPage = nextPage <= Math.ceil(count / perPage);

  res.render('index',{ 
     locals,
     data,
     current: page,
     nextPage: hasNextPage ? nextPage : null,
     currentRoute:'/'
    });

  }catch(error){
     console.log(error); 
  }
    
});

// router.get('', async (req,res) => {
  
//     const locals = {
//     title: "NodeJS Blog",
//     description:"Simple Blog Created with NodeJS,Express & MongoDB"
//   }
//   try{
//       const data = await Post.find();
//       res.render('index', { locals , data});

//   }catch(error){
//      console.log(error); 
//   }
    
// });

/** 
*GET/
*Post:id
*/

router.get('/post/:id', async (req,res) => {
  try{  
    let slug = req.params.id;

    const data = await Post.findById({_id: slug });

      const locals = {
      title: data.title,
      description:"Simple Blog Created with NodeJS,Express & MongoDB",
      currentRoute:`/post/${slug}`
       }

    res.render('post', { locals , data});
  
    }catch(error){
       console.log(error); 
    }
  });

/** 
*GET/
*Post:searchTerm
*/

router.post('/search', async (req,res) => {
  
   
  try{ 

    const locals = {
      title: "search",
      description:"Simple Blog Created with NodeJS,Express & MongoDB"
    }
   
    let searchTerm= req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"")
       
      const data = await Post.find({
        $or:[
          {title:{$regex: new RegExp(searchNoSpecialChar,'i') }},
          { body: { $regex : new RegExp (searchNoSpecialChar,'i') }}
         ]
      });

      res.render('search', { data , locals });

  }catch(error){
     console.log(error); 
  }
    
});

router.get('/about', (req,res) => {
    res.render('about',{
      currentRoute:'/about'
    });
});


router.get('/contact', (req,res) => {
  res.render('contact',{
    currentRoute:'/contact'
  });
});

module.exports = router;

// function insertPostData () {
//   Post.insertMany([
//     {
//      title: "Building a blog",
//      body:" This is the body text" 
//     },
//     {
//       title: "Build real-time, event driven application in node js",
//       body:" SOcket.io: Learn how to use SOcket.io to build real time, event driven application in node js" 
//      },
//      {
//       title: "Discover how to use Express.js",
//       body:" Discover how to use EXpress.js, a popular Node JS web framework, to build web applictaion" 
//      },
//      {
//       title: "Learn the basics of Node JS and its architecture",
//       body:" Learn the basics of node js and its architecture, how it works,and why it is popular among developers" 
//      },
//      {
//       title: "Node JS limiting Network Traffic",
//       body:" Learn how to limit network traffic" 
//      },
//      {
//       title: "Learn Morgan - HTTP request logger for NodeJS",
//       body:" Learn Morgan" 
//      },
//      {
//       title: "Learn Angular - Front end framework ",
//       body:" Learn Angular" 
//      },

//   ])
// }

// insertPostData();