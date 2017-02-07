function initSearch() {
  var BODY = document.body
  console.log(333)
  var form = document.querySelector('.search-form')
  var inputElements = document.querySelectorAll('.search-input')

  BODY.addEventListener('click', function (e) {
    var target = e.target,
        resultsPanel = document.querySelectorAll('.results-panel.show')

    Array.prototype.forEach.call(resultsPanel, function (item, index) {
      if (!item.contains(target)) {
        item.classList.remove('show')
      }
    })
  })

  var root = '/'

  Array.prototype.forEach.call(inputElements, function (input, index) {
    input.addEventListener('input', function (e) {
      var target = e.target,
          panel = target.parentElement && target.parentElement.nextElementSibling,
          keywords = target.value.trim().split(/[\s\-\，\\/]+/)

      if (target.value.trim() !== '') {
        console.log(keywords)
        var matchingPosts = searchFromJSON(window.__searchindex, keywords)
        var html = ''

        console.log(matchingPosts)
        matchingPosts.forEach(function (post, index) {
          var url = root + post.slug
          var htmlSnippet = '<div class=\"matching-post\">' +
                              '<h2>' +
                                '<a href=\"' + url + '\">' + post.title + '</a>' +
                              '</h2>' +
                              '<p>' + post.body + '</p>' +
                            '</div>'

          html += htmlSnippet
        })
        if (panel.classList.contains('results-panel')) {
          panel.classList.add('show')
          panel.innerHTML = html ? html : '<p>No Results!</p>'
        }
      } else {
        if (panel.classList.contains('results-panel')) {
          panel.classList.remove('show')
          panel.innerHTML = ''
        }
      }
    })
  })
}

function searchFromJSON (data, keywords) {
  var matchingResults = []

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
  // matchingResults.sort(function (a, b) {
  //   return a.matchingNum > b.matchingNum
  // })

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

window.onload = initSearch