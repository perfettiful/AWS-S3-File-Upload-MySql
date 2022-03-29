const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const fs = require('fs')
const path = require('path')

const app = express()

const database = require('./database')

const { uploadFile, getFileStream }  = require('./s3')

app.use(express.static('public'))

app.get('/images/:filename', async (req, res) => {
  const filename = req.params.filename

  if (filename.length > 10 && filename !== 'undefined'){
    try {
      
      console.log("looking up s3 image with this key: ", filename);

      const readStream = await getFileStream(filename);
      readStream.pipe(res);
    } catch (error) {
      console.log(error)
    }
  } else {
    res.status(400).json( "XXXX Your request was bad, and you should feel bad X( ")
  }

})

app.get('/posts', (req, res) => {
  database.getPosts((error, posts) => {
    if (error) {
      res.send({error: error.message})
      return
    }
    res.send({posts})
  })

})

app.post('/posts', upload.single('image'), async (req, res) => {
  const { filename, path } = req.file
  const description = req.body.description

  await uploadFile(req.file)

  // save these details to a database
  const image_url = `/images/${filename}.jpg`

  console.log(" +++ Saving image: ", image_url)
  database.createPost(description, image_url, (error, insertId) => {
    if (error) {
      res.send({error: error.message})
      return
    }
    res.send({
      id: insertId,
      description,
      image_url
    })
  })
})


const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})