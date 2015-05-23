jQuery(document).ready(function(){
        $( "#draggable1, #draggable2,#draggable3,#draggable4" ).draggable();
        $( ".droppable" ).droppable({
            accept: "#draggable",
            activeClass: "ui-state-hover",
            hoverClass: "ui-state-active",
            drop: function( event, ui ) {
                $( this )
                .addClass( "ui-state-highlight" )
                .find( "p" )
                .html( "Dropped!" );
            }
        });
    });
