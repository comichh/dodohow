var map;
var picmarker;
var pictureIndex;
	
function initialize() {
  var mapOptions = {
	zoom: 14,
	center: new google.maps.LatLng(slat, slng)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  picMarker = new google.maps.Marker({
      position: new google.maps.LatLng(slat, slng),
      map: map,
	  draggable:true,
      title: 'Picture Position'
  });
  google.maps.event.addListener(map, 'click', function(event){ 
		picMarker.setPosition(event.latLng);
		map.setCenter(event.latLng);
		$('#position_'+pictureIndex).html(event.latLng.lat()+","+event.latLng.lng());
  });
  
  google.maps.event.addListener(picMarker, 'dragend', function(event){ 
		map.setCenter(event.latLng);
		$('#position_'+pictureIndex).html(event.latLng.lat()+","+event.latLng.lng());
  });
  
}
jQuery(document).ready(function($) {
	google.maps.event.addDomListener(window, 'load', initialize);
	getTripPicture(tripID);	
});

var jsonArray;
function getTripPicture(getID){
	var fullUrl="./common/lib/php/GetGalleryPicture.php?tripID="+getID;
	$.ajax({
		url:fullUrl,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			jsonArray=eval('('+Jdata+')');
			var divstr='';
			if(jsonArray.length>0){
				for(var index=0;index<jsonArray.length;index++){
					divstr+='<li>';
					divstr+='	<a class="thumb" name="leaf" href="'+jsonArray[index].pic_name+'" title="Title #0">';
					divstr+='		<img id="p'+jsonArray[index].index+'" src="'+jsonArray[index].pic_name+'" style="width:75px;height:75px" alt="Title #0" onclick="showImage(\'p'+jsonArray[index].pic_id+'\',\''+jsonArray[index].pic_name+'\','+index+')" />';
					divstr+='	</a>';
					divstr+='	<div class="caption">';
					divstr+='		<div class="image-title">名稱'+'<div><input type="text" id="Title_'+index+'" size=20 value="'+jsonArray[index].pic_title+'" /></div></div>';
					divstr+='		<div class="image-desc">照片位置'+'<div id="position_'+index+'">'+jsonArray[index].pic_lat+","+jsonArray[index].pic_lng+'</div></div>';
					divstr+='		<div class="image-desc">簡述'+'<div><input type="text" id="description_'+index+'" size=40 value="'+jsonArray[index].pic_descript+'"/></div></div>';
					divstr+='		<div class="download">';
					divstr+='			<a href="'+jsonArray[index].pic_name+'" target="_blank">Download Original</a><button onclick="updatePictureInfo('+index+')">更新</button>';
					divstr+='		</div>';
					divstr+='	</div>';
					divstr+='</li>';
				}
				$('#GalleryContent').html(divstr);
				setTimeout(function(){
					initGallery();
				},500);
				showImage('','',0);
			}
						
		},
		error: function() {

		}
	});
}


function showImage(ImgName,imageUrl,index) {
	window.parent.closeInfoWindow();
	pictureIndex=index;
	/*
	var oImg=document.getElementById(ImgName);
	EXIF.getData(oImg, 
		function() {
			var aLat = EXIF.getTag(oImg, "GPSLatitude");
			var aLong = EXIF.getTag(oImg, "GPSLongitude");

			if (!(aLat && aLong)){
				$('#position').html('');
				return; // whoops, no GPS info
			}
			var strLatRef = EXIF.getTag(oImg, "GPSLatitudeRef") || "N";
			var strLongRef = EXIF.getTag(oImg, "GPSLongitudeRef") || "W";
			var fLat = (aLat[0] + aLat[1]/60 + aLat[2]/3600) * (strLatRef == "N" ? 1 : -1);
			var fLong = (aLong[0] + aLong[1]/60 + aLong[2]/3600) * (strLongRef == "W" ? -1 : 1);
			window.parent.setMapCenterByImage(fLat,fLong,imageUrl);
			map.setCenter(new google.maps.LatLng(fLat, fLong));
			google.maps.event.trigger(map, "resize");
		}
	);
	*/
}
document.write('<style>.noscript { display: none; }</style>');

function initGallery(){
	// We only want these styles applied when javascript is enabled
	$('div.content').css('display', 'block');

	// Initially set opacity on thumbs and add
	// additional styling for hover effect on thumbs
	var onMouseOutOpacity = 0.67;
	$('#thumbs ul.thumbs li, div.navigation a.pageLink').opacityrollover({
		mouseOutOpacity:   onMouseOutOpacity,
		mouseOverOpacity:  1.0,
		fadeSpeed:         'fast',
		exemptionSelector: '.selected'
	});
	
	// Initialize Advanced Galleriffic Gallery
	var gallery = $('#thumbs').galleriffic({
		delay:                     2500,
		numThumbs:                 10,
		preloadAhead:              10,
		enableTopPager:            false,
		enableBottomPager:         false,
		imageContainerSel:         '#slideshow',
		controlsContainerSel:      '#controls',
		captionContainerSel:       '#caption',
		loadingContainerSel:       '#loading',
		renderSSControls:          true,
		renderNavControls:         true,
		playLinkText:              'Play Slideshow',
		pauseLinkText:             'Pause Slideshow',
		prevLinkText:              '&lsaquo; Previous Photo',
		nextLinkText:              'Next Photo &rsaquo;',
		nextPageLinkText:          'Next &rsaquo;',
		prevPageLinkText:          '&lsaquo; Prev',
		enableHistory:             true,
		autoStart:                 false,
		syncTransitions:           true,
		defaultTransitionDuration: 900,
		onSlideChange:             function(prevIndex, nextIndex) {
			// 'this' refers to the gallery, which is an extension of $('#thumbs')
			this.find('ul.thumbs').children()
				.eq(prevIndex).fadeTo('fast', onMouseOutOpacity).end()
				.eq(nextIndex).fadeTo('fast', 1.0);

			// Update the photo index display
			this.$captionContainer.find('div.photo-index')
				.html('Photo '+ (nextIndex+1) +' of '+ this.data.length);
		},
		onPageTransitionOut:       function(callback) {
			this.fadeTo('fast', 0.0, callback);
		},
		onPageTransitionIn:        function() {
			var prevPageLink = this.find('a.prev').css('visibility', 'hidden');
			var nextPageLink = this.find('a.next').css('visibility', 'hidden');
			
			// Show appropriate next / prev page links
			if (this.displayedPage > 0)
				prevPageLink.css('visibility', 'visible');

			var lastPage = this.getNumPages() - 1;
			if (this.displayedPage < lastPage)
				nextPageLink.css('visibility', 'visible');

			this.fadeTo('fast', 1.0);
		}
	});

	/**************** Event handlers for custom next / prev page links **********************/

	gallery.find('a.prev').click(function(e) {
		gallery.previousPage();
		e.preventDefault();
	});

	gallery.find('a.next').click(function(e) {
		gallery.nextPage();
		e.preventDefault();
	});

	/****************************************************************************************/

	/**** Functions to support integration of galleriffic with the jquery.history plugin ****/

	// PageLoad function
	// This function is called when:
	// 1. after calling $.historyInit();
	// 2. after calling $.historyLoad();
	// 3. after pushing "Go Back" button of a browser
	function pageload(hash) {
		// alert("pageload: " + hash);
		// hash doesn't contain the first # character.
		if(hash) {
			$.galleriffic.gotoImage(hash);
		} else {
			gallery.gotoIndex(0);
		}
	}

	// Initialize history plugin.
	// The callback is called at once by present location.hash. 
	$.historyInit(pageload, "advanced.html");

	// set onlick event for buttons using the jQuery 1.3 live method
	$("a[rel='history']").live('click', function(e) {
		if (e.button != 0) return true;

		var hash = this.href;
		hash = hash.replace(/^.*#/, '');

		// moves to a new page. 
		// pageload is called at once. 
		// hash don't contain "#", "?"
		$.historyLoad(hash);
		return false;
	});
}

function updatePictureInfo(index){
	alert($('#Title_'+index).val());
}

function setStartPositionOnMap(){
	var latlng=new google.maps.LatLng(parseFloat(slat),parseFloat(slng));
	picMarker.setPosition(latlng);
	map.setCenter(latlng);
}
