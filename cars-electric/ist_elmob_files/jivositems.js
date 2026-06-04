function id(name)
{
    return document.getElementById(name);
}

function show_jivo()
{
    jQuery('#wrap_jivositems').animate({right: 0}, 300);
    jQuery('#wrap_jivositems').removeClass('concealed');
}

function hide_jivo()
{
    jQuery('#wrap_jivositems').animate({right: -303}, 300);
    jQuery('#wrap_jivositems').addClass('concealed');
}

var loc = window.location;

$('#hide-jivositems').hover(function(){}, function(){});

$(document).delegate(
    '#hide-jivositems'
    , 'click'
    , function(e){
        hide_jivo();
    }
);

$(document).delegate(
    '#ask'
    , 'click'
    , function(e){
        if ($('#wrap_jivositems').hasClass('concealed'))
            show_jivo();
        else
            hide_jivo();
    }
);
