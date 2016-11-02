function getCategoryAlbumsDoc(categoryID, keywordID, title, callback) {
    var url;
    if (keywordID=='moduleType3') {
        url = `http://mobile.ximalaya.com/mobile/discovery/v1/category/filter/albums?calcDimension=hot&categoryId=${categoryID}&device=iPhone&pageId=1&pageSize=20&version=5.4.45`;
    } else {
        url = `http://mobile.ximalaya.com/mobile/discovery/v1/category/filter/albums?calcDimension=hot&categoryId=${categoryID}&keywordId=${keywordID}&device=iPhone&pageId=1&pageSize=20&version=5.4.45`;
    }
    getHTTP(url, function(content){
        var data = JSON.parse(content)['list'];
        var docText = `<?xml version="1.0" encoding="UTF-8" ?>
            <document>
              <head>
                <style>
                .overlay_title {
                    background-color: rgba(0,0,0,0.6);
                    color: #FFFFFF;
                    text-align: center;
                }
                .overlay {
                    padding: 0;
                }
                </style>
              </head>
               <stackTemplate>
                  <banner>
                    <title><![CDATA[${title}]]></title>
                  </banner>
                  <collectionList>
                    <grid>
                        <section>`;
        var list = data;
        for(var i in list) {
            var imgpath=data[i]['coverLarge'];
            docText += `
                            <lockup onselect="showAlbum(${list[i]['albumId']})">
                                <img src="${imgpath}" width="350" height="350" />
                                <title><![CDATA[${list[i]['title']}]]></title>`;
            if (list[i]['isPaid']) {
                docText += `
                                  <overlay class="overlay">
                                      <title class="overlay_title">付费</title>
                                  </overlay>`;
            }
                docText += `
                            </lockup>`;
        }
        docText += `
                        </section>
                     </grid>
                  </collectionList>
               </stackTemplate>
            </document>`;
        console.log("docText: "+docText);
        callback((new DOMParser).parseFromString(docText, "application/xml"));
    });
}

function showCategoryAlbums(categoryID, keywordID, title) {
    const loadingDocument = createLoadingDocument("Ximalaya加载中..");
    navigationDocument.pushDocument(loadingDocument);
    getCategoryAlbumsDoc(categoryID, keywordID, title, function(doc){
        navigationDocument.replaceDocument(doc, loadingDocument);
    });
}
