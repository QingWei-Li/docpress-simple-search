function initComponent () {
  var nav = document.querySelector('.header-nav .right')
  var html = '<div><input type="search" class="search-input" /><div class="results-panel"></div></div>'
  nav.innerHTML += html
}

function initSearch () {
  initComponent()

  var inputElements = document.querySelectorAll('.search-input')
  var root = '/'

  document.body.addEventListener('click', function (e) {
    var target = e.target,
      resultsPanel = document.querySelectorAll('.results-panel.show')

    Array.prototype.forEach.call(resultsPanel, function (item, index) {
      if (!item.contains(target)) {
        item.classList.remove('show')
      }
    })
  })

  Array.prototype.forEach.call(inputElements, function (input, index) {
    input.addEventListener('input', function (e) {
      var target = e.target,
        panel = target.nextElementSibling

      if (target.value.trim() !== '') {
        var matchingPosts = window.Search(target.value)
        var html = ''

        matchingPosts.forEach(function (post, index) {
          var url = root + post.url
          var htmlSnippet = '<div class=\"matching-post\">' +
                              '<h2>' +
                                '<a href=\"' + url + '\">' + post.title + '</a>' +
                              '</h2>' +
                              '<p>' + post.content + '</p>' +
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

window.onload = initSearch
