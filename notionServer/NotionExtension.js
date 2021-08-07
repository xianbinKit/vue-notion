
const { Client } = require("@notionhq/client")

class NotionExtension {
  constructor(authKey) {
    if(!authKey){
      throw('authKey required')
    }
    const notion = new Client({
      auth: authKey,
    })
    this.notion = notion
  }

  async  getBlocks({pageId, recursive = true}){
  var blocks = []
  var hasMore = true
  var start_cursor
  const page_size = 100 // max is 100 mentioned in notion doc
  while(hasMore){
    const input = {
      block_id: pageId,
      page_size: page_size,
      start_cursor: start_cursor
    }
    const res = await this.notion.blocks.children.list(input)
  
    if(!res || !res.results || res.results.length === 0){
      break
    }

    hasMore = res.has_more
    const thisBlocks = res.results
    start_cursor = res.next_cursor
    if(recursive){
      var childBlocksPromise = []
      thisBlocks.forEach( block => {
        if(block.has_children){
            const promiseFunc = this.getBlocks({pageId: block.id}).then(childBlocks => {
              block.blocks = childBlocks
              return Promise.resolve()
            })
            childBlocksPromise.push(promiseFunc)
        }
      })
      if(childBlocksPromise.length > 0){
        await Promise.all(childBlocksPromise)
      }
    }
    blocks = blocks.concat(thisBlocks)
  }
  return blocks
}

async  getPageWithBlocks({pageId}){
  if(!pageId){
    throw('pageId is required')
  }
  try {
    // get page
    let page = await this.notion.pages.retrieve({ page_id: pageId })    
    // get page's blocks
    page.blocks = await this.getBlocks({pageId})
   
    return page 
  } catch (error) {
    console.error(error.message)
    throw(error.message)
  }
  

}




}

exports.NotionExtension = NotionExtension
