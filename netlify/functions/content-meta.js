const ogs = require('open-graph-scraper');
const { resCallback, response } = require('./utils/helper');

exports.handler = function (event, context, callback) {
    const params = JSON.parse(event.body)
    const url = params.url

     ogs({ url: url })
            .then(function(data) {
            const { error, result, response } = data;
            
            if(error)
                 resCallback(400, {'errors': error }, callback)

             //Set Owner
             let owner = result.ogSiteName ? result.ogSiteName : ''
             if(result.author)
                owner = result.author

            //Set PublishDate
            let publishDate = result.ogDate ? result.ogDate : new Date()
            if(result.articlePublishedTime)
                publishDate = result.articlePublishedTime
            

            resCallback(200, {
                    title: result.ogTitle,
                    body: result.ogDescription,
                    url: result.requestUrl,
                    owner: owner,
                    thumbnail: result.ogImage ? result.ogImage.url : '',
                    original_published_at: publishDate,
                    tags: '',
                }, callback)
        }).catch((error) => {
            resCallback(400, {'errors': error }, callback)
        })
}

