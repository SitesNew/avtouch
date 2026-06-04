// Collapsible sidebar:
 
  $( function() {
 
    // Collapse initially (if viewport <= 480px)
    var collapsed = true;
 
    // Toggle sidebar content on click
    $('#sidebar .inner>span').click( function() {
      collapsed = !collapsed;
      formatSidebar();
    } );
 
    // Format sidebar whenever the window is resized
    $(window).resize( formatSidebar );
 
    // Format sidebar when the page first loads
    formatSidebar();
 
    // Show full sidebar if viewport > 480px
    // Show expanded or collapsed sidebar if viewport <= 480px
    function formatSidebar() {
      if ( $(window).width() > 480 ) {
        $('#sidebar').removeClass( 'collapsible' );
        $('#sidebar .inner div').show();
      } else {
        $('#sidebar').addClass( 'collapsible' );
        if ( collapsed ) {
          $('#sidebar .inner div').hide();
          $('#sidebar .inner>span').removeClass( 'minus' );
        } else {
          $('#sidebar .inner div').show();
          $('#sidebar .inner>span').addClass( 'minus' );
        }
      }
    };
 
  } );

/* Collapsible menu */
$(function() {
  $('#menu-button').click(function() {
    var $this = $(this),
        $menu = $('#main-menu');
    if (!$this.hasClass('collapsed')) {
      $menu.addClass('collapsed');
      $this.addClass('collapsed');
    } else {
      $menu.removeClass('collapsed');
      $this.removeClass('collapsed');
    }
    return false;
  }).click();
});
