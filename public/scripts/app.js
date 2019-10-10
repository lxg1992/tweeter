

const renderTweets = function(tweets) {
  //Empty the twitterFeed and for each item from JSON response array append the item to the twitterFeed
  const $twitterFeed = $('.tweetFeed');
  $twitterFeed.empty();
  for (let tweet of tweets) {
    let $tweetHTML = createTweetElement(tweet);
    $twitterFeed.prepend($tweetHTML);
  }
};

const escape =  function(str) {
  //Sterilize the input
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

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
      <p class="cf break">${escape(content.text)}</p>
    </div>

    <footer>
      <div class="fb">
        <span>${new Date(created_at).toLocaleString()}</span>
        <span class="push">
            <i class="fas fa-flag hoverITEM"></i>
            <i class="fas fa-retweet hoverITEM"></i>
            <i class="fas fa-heart hoverITEM"></i>
        </span>
      </div>
    </footer>
  </article>`
  );
};

const sendTweetHandler = function() {
  //Attach a handler to the 'TWEET' button which sends an AJAX POST request
  const $form = $('.tweetForm');
  const $error = $('.error');
  $form.on('submit',async function(event) {
    let textVal = $form.find('#newTweetText').val();
    event.preventDefault();
    if (textVal === '' || null) {
      $error.css('visibility','visible');
      $error.text('Please enter text into input');
      $('html, body').animate(
        {
          scrollTop: $($error).offset().top - 120,
        }, 
        500,
        'linear'
      );
    } else if (textVal.length > 140) {
      $error.css('visibility','visible');
      $error.text('Text is too long!');
      $('html, body').animate(
        {
          scrollTop: $($error).offset().top - 120,
        },
        500,
        'linear'
      );
    } else {
      $error.css('visibility','hidden');
  
      let obj = event.target;
    
      await $.post('/tweets', $(obj).serialize()).fail((err)=>{
        console.log(err);
      }).done(loadTweets()).always(loadTweets());
    
    }
  });
};

const loadTweets = async function() {
  //AJAX GET and then send the 'data' response to renderTweets function as an argument
  await $.get("/tweets", (data) => {
    renderTweets(data);
  });
  
};

const newTweetAnchorHandler = function() {
  let isShown = false;
  let $composeBox = $('.new-tweet');
  $('a[href^="#"]').click(function(e) {
    e.preventDefault();
    if(!isShown){
      $composeBox.removeClass('jqINVISIBLE').addClass('jqVISIBLE');      
      $('html,body').animate(
        { 
          scrollTop: ($(this.hash).offset().top) - 200
        }, 
        500
        );
      $('#newTweetText').focus();
      isShown = true;
      return false;
    } else {
      //If box IS shown
     
      $composeBox.removeClass('jqVISIBLE').addClass('jqINVISIBLE');
      //$composeBox.css('display','none')
      

      isShown = false;
      return false;

    }
  });
};

const enterKeyHandler = function() {
  let $nTT = $('#newTweetText');
  $nTT.keypress(function (e) {
    if (e.which === 13) {
      $('.tweetForm').submit();
      $nTT.val('');
      return false;
    }
  });
}

$(document).ready(function() {
  newTweetAnchorHandler();
  loadTweets();
  sendTweetHandler();  
  enterKeyHandler();

  $('.new-tweet').removeClass('jqVISIBLE').addClass('jqINVISIBLE');
});



