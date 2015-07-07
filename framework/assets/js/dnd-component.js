  jQuery(document).ready(function(){
    $( ".draggable").draggable();

    $( ".droppable" ).droppable({
      drop: function( event, ui ) {
      $( '.droppable' ).data( 'hover', 0 );
      $( this )
      .addClass( "ui-state-highlight" )
      .find( "p" )
      .html( "Dropped!" );
      }
    });
    
  });