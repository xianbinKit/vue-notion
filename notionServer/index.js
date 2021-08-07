const express = require('express')
var cors = require('cors')

const app = express()
app.use(cors())

app.use(express.urlencoded({extended: true})); 
app.use(express.json())
 

const port = 3000

const {NotionExtension} = require('./NotionExtension')
console.log('notion key:', process.env.NOTION_SECRET)
const notionExt = new NotionExtension(process.env.NOTION_SECRET)

app.post('/getPageWithBlocks', async (req, res) => {
  const pageId = req.body.pageId
  if(!pageId){
    res.json({error: 'pageId required'})
  }
  console.log('getPageWithBlocks pageId:',pageId)
  const page  = await notionExt.getPageWithBlocks({pageId: pageId})
  res.json(page)
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
