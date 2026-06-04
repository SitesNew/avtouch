$(document).ready(function () {

    $('.catalog-seo a:not(.icon , .templ)').live("click",function(e){

        var li = $(this).closest('li');
        if(li.hasClass('collapsed')){
            e.preventDefault();

            li.siblings().each(function(){
                if($(this).hasClass('collapsed')){
                    $(this).find('> ul').removeClass('open');
                    $(this).find('> a').removeClass('minus');
                }
            });

            li.find('> ul').toggleClass('open');
            $(this).toggleClass('minus');
        }
    });
	$('.vi-table-a').live("click",function(){
		$(this).closest('.param').find('.data').toggleClass('hidden');
		$(this).toggleClass('minus');
	});
    $(".legend").live("click",function () {

        if ($(this).next(".legend-context").css("display") == "none" || $(".legend-context").css("display") == "") {
            $(this).next(".legend-context").show();
            $(this).find("span").css('background', "#ffffff url('../i/menu-expanded.gif') no-repeat 0% 50%");
        }
        else {
            $(this).next(".legend-context").hide();
            $(this).find("span").css('background', "#ffffff url('../i/menu-collapsed.gif') no-repeat 0% 50%");
        }
        return false;
    });

    $('section.links > ul > li + ul').css('display', 'none');

    var list = $('section.links > ul > li')
    for (var i = 0; i < list.length; i++)
    {
        if (list.eq(i).children('a').length == 0)
        {
            list.eq(i).addClass('collapse close');
            list.eq(i).html(
                '<span>' + list.eq(i).text() + '</span>'
            )
        }
    }


    $('section.links > ul > li.collapse').live('click', function(){
        if ($(this).hasClass('close'))
        {
            $(this).next().slideDown();
            $(this).removeClass('close');
            $(this).addClass('opened');
        }
        else
        {
            $(this).next().slideUp();
            $(this).removeClass('opened');
            $(this).addClass('close');
        }
    })


    $('.prim-car span').live("click",function(){
        if ($(this).nextAll('ul').css('display') == 'none')
        {
            $(this).nextAll('ul').slideDown()
            $(this).addClass('open')
        }
        else
        {
            $(this).nextAll('ul').slideUp();
            $(this).removeClass('open')
        }
    })




});
