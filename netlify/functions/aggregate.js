const SourceDB = require('./database/SourceDB');
const ContentDB = require('./database/ContentDB');
const { resCallback } = require('./utils/helper');

let Parser = require('rss-parser');
let parser = new Parser();

exports.handler = async function (event, context, callback) {
    const {data: activeSources, error} = await SourceDB.getActiveSource()
    
    if(error) {
         resCallback(error.status, {'msg' : error.message}, callback)
    }

    //aggregate
     const result = await checkRSS(activeSources)
     resCallback(200, {'msg' : 'successed'}, callback)
}


async function checkRSS(activeSources) {
    //loop rss list
    for (i = 0; i < activeSources.length; i++) {
        let currentRSS = activeSources[i]
        let feed = await parser.parseURL(currentRSS.url);
         
        let NEW_ITEMS = []    
        //New update   
            //if rss build date later than last checked
        if(new Date(feed.lastBuildDate) > new Date(currentRSS.last_checked_at)) {
            feed.items.forEach(item => {
                let published_at = item.pubDate || item.isoDate
                //check item time
                if(new Date(published_at) > new Date(currentRSS.last_checked_at)) {
                    //prepare items to be inserted
                    NEW_ITEMS.push({
                        "title" : item.title || feed.title,
                        "url" : item.link || item.guid,
                        "body" : item.contentSnippet || item.description,
                        "owner" : item.creator,
                        "original_published_at" : published_at,
                        "tags" : (item.categories) ? item.categories.join() : '',
                        "media" : currentRSS.media,
                        "source_id" : currentRSS.id,
                        "contributor" : currentRSS.contributor,
                    })
                }
            });
        }

        //insert bulk to database
        if(NEW_ITEMS.length != 0) {
            let {insertData, error} = await ContentDB.storeBulk(NEW_ITEMS)
            if(error) {           
                console.log(error)
            }

            //update last_cheked_at of "the RSS"
            let {updateTime, errorUpdateTime} = await SourceDB.updateTime(new Date(feed.lastBuildDate), currentRSS.id)

            if(errorUpdateTime)
                    console.log(errorUpdateTime)

            if(updateTime) {           
                console.log("updateTime udpate latest rss")
                console.log(updateTime)
            }
        }
    }//end loop RSS

    return true
}