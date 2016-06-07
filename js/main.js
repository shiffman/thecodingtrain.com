var apiKey 				= "AIzaSyADOKEHZag2UMG52bd7ApxDOssdzVo0j8I";
var shiffmanPlaylists 	= ["PLRqwX-V7Uu6YVljJvFRCyRM6mmF5wMPeE, PLRqwX-V7Uu6ZwSmtE13iJBcoI-r4y7iEc"];
var shiffmanChannelId 	= "UCvjgXvBlbQiydffZU7m1_aw";

var player;

$(document).ready(function(){

	window.onYouTubePlayerAPIReady = function() {
      getLatest();
      getPlaylists();
    };

});

function getLatest() {

	$.get('https://www.googleapis.com/youtube/v3/search?key='+apiKey, { part: 'snippet' , channelId: shiffmanChannelId, order: 'date' })
	.done(function(data){

		var videoID = data.items[0].id.videoId;
		buildPlayer(videoID, 'latest-video');

	}, 'JSON')
	.error(function(){

		console.log('Can not find the latest video');

	});

}

function buildPlayer(id, el) {
	   
	   player = new YT.Player(el, {
	      height: '390',
	      width: '640',
	      videoId: id,
	      events: {
	        'onReady': onPlayerReady,
	      }
	    });
	  }

	  function onPlayerReady(event) {
	    $(".latest-container").fitVids();
	    $(".latest-container").addClass('in');
	  }

	  function stopVideo() {
	    player.stopVideo();
	  }

function getPlaylists() {

	for (var i = 0; i < shiffmanPlaylists.length; i++) {
		
		$.get('https://www.googleapis.com/youtube/v3/playlists?key=AIzaSyADOKEHZag2UMG52bd7ApxDOssdzVo0j8I', { part: 'snippet' , id: shiffmanPlaylists[i]})
		.done(function(data){

			populateData(data);

		}, 'JSON')
		.error(function(){

			alert('Ahh sorry we couldn\' theres a problem');

		});

	}

}

function populateData(data) {

	$.each(data.items, function(index, playlist){

		var target = $('#playlist-'+index);
		console.log('playlist');

		target.find('h2').html(playlist.snippet.title);

		videoList(target, playlist);

	});

}

function videoList(target, playlist) {

	var limit = 3;

	$.get('https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyADOKEHZag2UMG52bd7ApxDOssdzVo0j8I', {part: 'snippet', playlistId: playlist.id} )
	.done(function(data){

			$.each(data.items, function(index, item){

				console.log(item)

				if (index < limit) {

					var vidSnip = item.snippet;

					var html = '<a href="http://youtube.com/video/'+vidSnip.resourceId.videoId+'" target="_blank" class="feature-video">'+
					        			'<div class="thumb" style="background-image: url('+vidSnip.thumbnails.high.url+');">'+
					        			'</div>'+
					        			'<div class="feature-description">'+
					        				'<h3>'+vidSnip.title+'</h3>'+
					        			'</div>'+
					        	'</a>';

					$(target).append(html);
					
				}
			
			});

	}, 'JSON');

}
