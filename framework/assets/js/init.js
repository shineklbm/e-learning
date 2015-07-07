jQuery(document).ready(function($){
	$.getJSON("config/commons.json", function(result){
        $.each(result, function(i, field){
            $("div").append(field + " ");
        });
    });
});