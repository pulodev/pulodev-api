const querystring = require('querystring');
const ogs = require('open-graph-scraper');
const { resCallback } = require('./utils/helper');

exports.handler = function (event, context, callback) {
    const params = querystring.parse(event.body)

    ogs({ url: params.url })
        .then((data) => {
            const { error, result, response } = data;
            
            console.log(result)

            resCallback(200, {
                    title: result.ogTitle,
                    body: result.ogDescription,
                    url: result.requestUrl,
                    owner: result.ogSiteName ? result.ogSiteName : '',
                    thumbnail: result.ogImage ? result.ogImage.url : '',
                    media: result.ogType ? result.ogType : '',
                    original_published_at: result.ogDate,
                    tags: '',
                }, callback)
        })
}

