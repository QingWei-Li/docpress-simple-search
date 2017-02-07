// From [weex website] https://weex-project.io/js/common.js

window.Search = function (keywords) {
  var matchingResults = []
  var data = window.__searchindex

  keywords = keywords.trim().split(/[\s\-\，\\/]+/)

  for (var i = 0; i < data.length; i++) {
    var post = data[i]
    var isMatch = false
    var postTitle = post.title && post.title.trim(),
        postContent = post.body && post.body.trim(),
        postUrl = post.slug || '',
        postType = post.pagetitle
    var matchingNum = 0
    var resultStr = ''

    if(postTitle !== '' && postContent !== '') {
      keywords.forEach(function(keyword, i) {
        var regEx = new RegExp(keyword, "gi")
        var indexTitle = -1,
            indexContent = -1,
            indexTitle = postTitle.search(regEx),
            indexContent = postContent.search(regEx)

        if(indexTitle < 0 && indexContent < 0){
          isMatch = false;
        } else {
          isMatch = true
          matchingNum++
          if (indexContent < 0) {
            indexContent = 0;
          }

          var start = 0,
              end = 0

          start = indexContent < 11 ? 0 : indexContent - 10
          end = start === 0 ? 70 : indexContent + keyword.length + 60
          if (end > postContent.length) {
            end = postContent.length
          }

          var matchContent = '...' +
            postContent
              .substring(start, end)
              .replace(regEx, "<em class=\"search-keyword\">" + keyword + "</em>") +
              '...'

          resultStr += matchContent
        }
      })

      if (isMatch) {
        var matchingPost = {
          title: escapeHtml(postTitle),
          content: resultStr,
          url: postUrl,
          type: postType,
          matchingNum: matchingNum
        }

        matchingResults.push(matchingPost)
      }
    }
  }

  return matchingResults
}

function escapeHtml(string) {
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  }

  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  })
}
