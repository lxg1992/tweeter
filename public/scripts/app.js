/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// const data = {
//   "user": {
//     "name": "Newton",
//     "avatars": "https://i.imgur.com/73hZDYK.png",
//     "handle": "@SirIsaac"
//     },
//   "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//   "created_at": 1461116232227
// }

// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png"
//       ,
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd" },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ]

const renderTweets = function(tweets){
  const $twitterFeed = $('.tweetFeed')
  $twitterFeed.empty();
  for(let tweet of tweets){
    let $tweetHTML = createTweetElement(tweet);
    $twitterFeed.prepend($tweetHTML);
  }
}

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const createTweetElement = function({user, content, created_at}) {
  return (
  `<article class="tweet hoverSET">            
    <header>
          <div class="fb">
            <img src="${user.avatars}">
            <span>${user.name}</span>
            <span class="push hoverITEM handle">${user.handle}</span>
          </div>
    </header>

    <div>
      <p>${escape(content.text)}</p>
    </div>

    <footer>
      <div class="fb">
        <span>${new Date(created_at).toLocaleString()}</span>
        <span class="push">
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
        </span>
      </div>
    </footer>
  </article>`
  )
}

const sendTweetHandler = function() {
  const $form = $('.tweetForm');
  const $error = $('.error');
  $form.on('submit',async function(event) {
    let textVal = $form.find('#newTweetText').val();
    event.preventDefault();
    if(textVal === '' || null) {
      $error.css('visibility','visible');
      $error.text('Please enter text into input');
      $('html, body').animate(
        {
          scrollTop: $($error).offset().top - 120,
        },
        500,
        'linear'
      )

    } else if(textVal.length > 140) {

      $error.css('visibility','visible');
      $error.text('Text is too long!');
      $('html, body').animate(
        {
          scrollTop: $($error).offset().top - 120,
        },
        500,
        'linear'
      )
    } else {
      $error.css('visibility','hidden');
  
      let obj = event.target;
    
      await $.post('/tweets', $(obj).serialize()).fail((err)=>{console.log(err)}).done(loadTweets()).always(loadTweets());
    
    } 
  })
}

const loadTweets = async function() {
  await $.get("/tweets", (data) => {
    renderTweets(data);
  });
  ;
}

const newTweetAnchorHandler = function() {
  $('a[href^="#"]').click(function(e) {
    e.preventDefault();
    $('html,body').animate({ scrollTop: ($(this.hash).offset().top) - 200}, 500);
    $('#newTweetText').focus();
    return false;    
    });
}

$(document).ready(function() {
  newTweetAnchorHandler();
  loadTweets();
  sendTweetHandler();
  // $('a[href^="#"]').click(function(e) {
  //   e.preventDefault();
  //   $('html,body').animate({ scrollTop: $(this.hash).offset().top}, 1000);
  //   return false;
    
  //   });
  
})



