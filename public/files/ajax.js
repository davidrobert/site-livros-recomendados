// Config
if (typeof BASE_URL === 'undefined') {
	if(location.hostname.indexOf('thecodeplayer.') != -1){
		var BASE_URL = '';
	}
	else{
		var BASE_URL = '/thecodeplayer';
	}
}

$(document).ready(function() {
	
	$("#keyword").keyup(function() {
		var form = $(this).closest('form'),
		q = $(this).val();
				
		form.before("<img class='loader' src='images/loader.gif' />");
		$.get(BASE_URL + '/home/search', {'q': q}, function(data) {
			$(".loader").remove();
			if (data['status'] == 'success' && data['results'] > 0) {
				$(".wt_listing").replaceWith(data['content']);
			}
			else
			{
				$(".wt_listing").replaceWith("<div class='sorry wt_listing'>No results found</div>");
			}
		}, 'json');
	});
	
	// SHARE FEEDBACK
	$('#share_feedback').live('click', function() {
		form_data = $(this).closest('#feedback_modal').find('form').serialize();
		$.post(BASE_URL + '/home/shareFeedback', form_data, function(data) {
		
			if( data['status'] == 'success' ) {
				$('#feedback_modal').modal('hide');
				alert('Thanks for Sharing your Feedback');
			}
			
			if( data['status'] == 'failure' ) {
				alert( data['error'] );
			}
		
		}, 'json');
	});
	
	// SAVE WT
	/*$('#wt_submit').on('click', function() {
		var form = $(this).closest('form');
		
		var data = {
								title: $('#wt_title').val(),
								description: $('#wt_description').val(),
								html: $('textarea[name="html"]').val(),
								css: $('textarea[name="css"]').val(),
								js: $('textarea[name="js"]').val()
								};
		
		$.post(BASE_URL + '/play/add', data, function(data) {
			if (data['status'] == 'success') {
				alert('Saved Bro ;)');
			}
			else if (data['status'] == 'error') {
				alert(data['msg']);
			}
		}, 'json');
		
		return false;
	});*/
	
	// Ajax Upload for Item Screenshots
	
	function ajaxUpload(data) {
		if (data['status'] == 'success') {
			location.href = data['redirect_to'];
		}
		else if (data['status'] == 'error') {
			alert(data['msg']);
		}
	}
	
	$('.ajax_upload').submit(function() {
		//var descr = $('#description').val();
		var descr = $.trim(tinyMCE.activeEditor.getContent());
		
		var ajax_upload_data = {
			title:       $('#title').val(),
			description: descr,
			tags:        $('#tags').val(),
			html:        $('textarea[name="html"]').val(),
			css:         $('textarea[name="css"]').val(),
			js:          $('textarea[name="js"]').val(),
			uid:         $('#uid').val(),
			id:         $('#id').val(),
		};
		
		var options = {
							dataType:  'json',
							url: BASE_URL + '/play',
							success: ajaxUpload,
							data: ajax_upload_data,
							type: 'POST'
		};
		
		$(this).ajaxSubmit(options);
		
		return false;
	});
	
	// DELETE WALKTHROUGH
	$('ul.wt_listing a.delete').on('click', function() {
		var conf = confirm('Are you sure?');
		if (!conf) return false;
		
		var $this = $(this);
		var id = $(this).attr('data-id');
		
		$.post(BASE_URL + '/play/delete', {'id': id}, function() {
			$this.closest('li').fadeOut();
		}, 'json');
	
		return false;
	});
	
});

jQuery.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};
