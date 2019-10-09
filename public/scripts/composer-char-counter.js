$(document).ready(function() {
  $('#newTweetText').on('input', (e) => {
    let tweetLength = $(e.target).val().length;
    let counter = $(e.target).next().find('.counter');
    counter.text(140 - tweetLength);{
      if(tweetLength > 140){
        counter.addClass('JQwarning')
      } else {
        counter.removeClass('JQwarning');
      }
    }
  })
})

