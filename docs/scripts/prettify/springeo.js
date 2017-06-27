var $body = $('html');
var searchMap = {};
var currSearch = false;
var locationHref;

function updateSearchMap(){
  $('nav a').each(function(index, elt){
    var href = $(elt).attr('href');
    var rel = href.match(/([\w\.#]+\.html[\w\.#]*)(?!\/)/)[0].replace(".html","");
    rel = rel.split(/[\.#]/).filter(function (e) {return e.length>0});
    var key = rel[rel.length-1];
    var method = /#/.test(href) && rel.length>2?new RegExp(rel[0]):false;
    rel = rel.slice(0,rel.length-1);
    if(searchMap[key]){
      searchMap[key].links.push(href);
      searchMap[key].related = searchMap[key].related.concat(rel);
    } else {
      searchMap[key] = {
        method:method,
        links: [href],
        related: rel
      }
    }

    for(var relKey of rel){
      if(searchMap[relKey]){
        searchMap[relKey].related.push(key);
      } else {
        searchMap[relKey] = {
          links:[],
          related:[key]
        }
      }
    }
  });
}

function search(inSearch){
  var nbFound = 0;
  $('nav ul a').hide();
  var words = decodeURI(inSearch).split(/[\s\.#]/);

  var keys = Object.keys(searchMap);

  words.forEach(function (word, iWord) {
    for (var key of keys) {
      var reg = new RegExp(word, 'i');
      var match = reg.test(key);
      if(match) {
        if (words.length > 1 && match) {
          var bros = words.slice().filter(function (e) { return e.length>0; });
          bros.splice(iWord, 1);
          for (var i = 0; i < bros.length && match; i++) {
            match = false;
            for (var link of searchMap[key].links) {
              var broReg = new RegExp(bros[i],'i');
              if (match = broReg.test(link));
                break;
            }
          }
        }
        if (match) {
          nbFound++;
          for (var link of searchMap[key].links) {
            var $elt = $('nav a[href="' + link + '"]');
            $elt.show();
            $elt.siblings('ul.methods').show();
            // $elt.children('a').show();
          }
          for (var rel of searchMap[key].related) {
            for (var link of searchMap[rel].links) {
              if (!searchMap[key].method || searchMap[key].method.test(link)) {
                $elt = $('nav a[href="' + link + '"]');
                $elt.show();
                $elt.siblings('ul.methods').show();
              }
            }
          }
        }
      }
    }
    return nbFound;
  });
}

var searchTime = 0;
function searchChange(){
  if(searchTime)
    clearTimeout(searchTime);
  searchTime = setTimeout(function(){
    var word = $('#search').val();
    if(word == ""){
      currSearch = false;
      $('nav ul.methods').hide();
      $('nav ul a').show();
    } else {
      currSearch = word;
      search(word);
    }
  },300);
}

function smoothLink(e){

}

$(document).ready(function () {
    updateSearchMap();

    currSearch = decodeURI(window.location.search.replace('?search=',''));
    locationHref = window.location.href.replace(window.location.search,'');
    if(currSearch && currSearch.length>0){
      $('#search').val(currSearch);
      search(currSearch);
    }

    $('#search').on('keydown search',searchChange);
    //$body initialized for specific browser
    if(/Chrome/i.test(navigator.userAgent) || /Safari/i.test(navigator.userAgent) || /Opera/i.test(navigator.userAgent) || /Firefox/i){
        $body = $('body');
    }

  //Display the methods block of the selected Class/Object
  var highlight = locationHref.match(/[\w\.]+.html[#\w.]*/i);
  var navSelect = highlight[0].replace(/#[\w\.]+/i, '');
  if(highlight[0]!=navSelect){
    $('nav>ul a[href="'+highlight[0]+'"]').css('color','#00689A');
  }
  var $res = $('nav>ul a[href="'+navSelect+'"]');
  $res.css('color','#38BDFF');
  $res.siblings('ul.methods').show(300);

  //Update color of the Global block method event
  $('#global a').click(function(e){
    $('#global a').css('color','#000');
    $(e.target).css('color','#38BDFF');
  });

  //Update selected method color event
  $('nav ul.methods>li>a').click(function(e) {
    $('nav ul.methods>li>a').css('color','#98999A');
    $(e.target).css('color','#00689A');
  });

  //Smooth display change and scrolling
  // $('nav ul>li>a').click(function(e){
  //   e.preventDefault();
  //   var searchParam = currSearch ? '?search='+currSearch:'';
  //   var href = $(e.target).closest('a').attr("href");
  //   var selector = href.match(/#[\w\.]+/i);
  //   if(locationHref.match(/[\w\.]+.html/i)[0]!=href.match(/[\w\.]+.html/i)[0]){
  //     $res.siblings('ul.methods').hide(300);
  //     $('#main').fadeOut(400, function() {
  //       if(selector)
  //         window.location.href = href.replace(/#[\w\.]+/i,searchParam+selector);
  //       else window.location.href = href+searchParam;
  //     });
  //   } else if(selector){
  //     //escape dot char
  //     selector = selector[0].replace('.','\\.');
  //     $body.animate({scrollTop:$(selector).offset().top}, 300,function () {
  //       window.location.href = href.replace(/#[\w\.]+/i,searchParam+selector);
  //     });
  //   } else {
  //     window.location.href = href+searchParam;
  //   }
  // });
});
