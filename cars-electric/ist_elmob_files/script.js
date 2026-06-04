var small_cart_input_focus = false;

$(document).ready(function() {


    // Обработчик для всплывающего окна с сообщением о долге

    $('.close-popup').click(function(){
        $(this).closest('.md-modal').removeClass('md-show');
        document.cookie = "ReminderDebtShowMsg=false";
    });

    $('.debt-msg-popup .more-btn').click(function() {
        $(this).hide();
        $(this).closest('.debt-msg-popup').addClass('show-more-active').find('.descr').hide();
        $('.more-container').show();
    });

    // NEW HEADER SCRIPTS

    $('.new-header .mobile-menu-button').click(function(){ // Открытие и закрытие мобильного меню
        if($('.new-header .mobile-menu').hasClass('open')){
            hideMobileMenu();
        } else {
            $(this).addClass('toggle');
            $('.new-header .mobile-menu').addClass('open').slideDown(500);
        }
    });

    $('.new-header .drop-but').click(function(e){ // Открытие и закрытие категорий мобильного меню
        e.preventDefault();
        if($(this).hasClass('open')){
            $(this).removeClass('open').next().slideUp(500);
        } else {
            $(this).addClass('open').next().slideDown(500);
        }
    });

    $('#open-search-mobile').click(function(){ // Открытие поиска в мобильной версии
        $(this).parent().find('.search-mobile-container').addClass('show-this');
    });

    $('.close-search').click(function(){ // Закрытие поиска в мобильной версии
        $(this).parent().removeClass('show-this');
    });

    $('.new-header .user span, .new-header .header-cart span, #open-settings-mobile').click(function(){ // Показываем логин, корзину и настройки валюты и языка
        $(this).next().addClass('show-this');
        $(this).addClass('active');
        hideMobileMenu();
    });

    $(document).delegate('#close-cart-header-mobile', 'click', function(){ // Нажатие на иконку стрелочки в открытом блоке корзины на мобильной версии
        $('.new-header .cart-container').removeClass('show-this');
        $('.new-header .header-cart > span').removeClass('active');
    });

    $('#close-login-mobile').click(function(){ // Логин закрыть попап
        $('.new-header .login-container').removeClass('show-this');
        $('.new-header .user-cart-container .user > span').removeClass('active');
    });

    $('.settings-mobile-container > div > .active').click(function(){ // Открытие закрытие смены языка и валюты в мобильной версии
        if($(this).hasClass('open')){
            $(this).removeClass('open').next().slideUp(500);
        } else {
            $(this).addClass('open').next().slideDown(500);
        }
    });

    $( '.third-menu-inner .podkat, .third-menu-inner .cat').mouseenter(function(){
        var dataSrc = $(this).attr('data-src');
        $(this).closest('.third-menu-inner').find('.cat-image img').attr('src', dataSrc);
    });

    ifNotBoxClickHide($('.new-header .user .login-container'));
    ifNotBoxClickHide($('.new-header .header-cart .cart-container'));
    ifNotBoxClickHide($('.site-settings-mobile .settings-mobile-container'));

    function ifNotBoxClickHide(elem){
        $(document).mouseup(function (e){ // событие клика по веб-документу
            if (!elem.is(e.target) // если клик был не по нашему блоку
                && elem.has(e.target).length === 0) { // и не по его дочерним элементам
                elem.removeClass('show-this'); // скрываем его
                elem.prev().removeClass('active');
            }
        });
    }

    function hideMobileMenu(){
        $('.new-header .mobile-menu-button').removeClass('toggle');
        $('.new-header .mobile-menu').removeClass('open').slideUp(500);
    }

    // ИЗ-ЗА ЭТОЙ ФУНКЦИИ ОШИБКА. $().UItoTop({ easingType: 'easeOutQuart' });
    $().UItoTop({ easingType: 'easeOutQuart' });
    setActiveTab();

    /*
    * Выбор количества заказов на страницу
    **/
    $('.ord-per-page select').change(function(){
        var per_page_val = $(this).val();
        $('.ord-per-page-input').val(per_page_val);
        $('form.date-filter').submit();
    });


    /*
    * Отображение курса валют при наведении на валюту в меню
    * */

    $( '.navbar-right li' ).mouseenter( function(){
        $(this).find('.vi-val-rate').removeClass("hidden");
    } ).mouseleave(function(){
        $(this).find('.vi-val-rate').addClass("hidden");
    } );

    /*
   * Сортировка блоков на главной странице
   * */

	$('#sortable').sortable({
        axis: 'y',
        update: function (event, ui) {
            var data = $(this).sortable('serialize');
            console.log(data);
            // POST запрос. Можно осуществить через $.post или $.ajax
            $.ajax({
                data: data,
                type: 'POST',
                url: '/c/site_settings'
            });
        }
    });


    $(document).delegate('.close-popup-link', 'click', function(){
        $(this).closest('.popup').addClass('hidden');
    });

    $("#sortable input:checkbox").bind("change", function () {
        data = {
            name: $(this).attr("name"),
            status: 0
        };
        if($(this).attr("checked") == 'checked'){
            data.status = 1 ;
        }

        var dataJ=JSON.stringify(data);
        $.ajax({
            type: 'POST',
            url: '/c/site_settings',
            dataType: 'json',
            cache: false,
            data: {checks: dataJ},
            success: function(data) {
                var newarr = $.parseJSON(data);
                alert(newarr);
            }
        });

    });
    /* End сортировка блоков на главной странице*/

    /* Настройка Слайдера на главной*/
    $("#sortable-slider").live('mouseover',function(e) {
        $(this).sortable({
            axis: 'y',
            update: function (event, ui) {
                var data = $(this).sortable('serialize');
                // POST запрос. Можно осуществить через $.post или $.ajax
                $.ajax({
                    data: data,
                    type: 'POST',
                    url: '/c/site_settings',
                    cache: false
                });
            }
        });
    });

    $("#sortable-slider").on("change", "input:checkbox", function () {
        data = {
            id: $(this).attr("id"),
            status: 0
        };
        if($(this).attr("checked") == 'checked' ){
            data.status = 1 ;
        }

        var dataJ=JSON.stringify(data);
        $.ajax({
            type: 'POST',
            url: '/c/site_settings',
            dataType: 'json',
            cache: false,
            data: {slide_checks: dataJ}
        });

    });
    $("#sortable-slider").on("change", "input:text", function () {
        data = {
            id: $(this).attr("id"),
            link:$(this).attr("value")
        };
        var dataJ=JSON.stringify(data);
        $.ajax({
            type: 'POST',
            url: '/c/site_settings',
            dataType: 'json',
            cache: false,
            data: {slide_link: dataJ}
        });

    });
    $("#sortable-slider").on("click", ".slideDel", function () {
        var id = $(this).attr('slide_id');
        $.ajax({
            data: {slide_del:id},
            type: 'POST',
            url: '/c/site_settings',
            cache: false,
            success: function(data){
                $("#slide-"+id).remove();
            }
        });
        return false;
    });

    /* End сортировка слайдера на главной странице*/

    /*-----Увеличение и уменьшение допусков размерав в каталоге----*/
    $(document).delegate('#filterParams .d-dec', 'click', function () {
        var $input = $(this).parent().find('input');
        var val = $input.val();
        var decimalLenght = (val.toString().includes('.')) ? (val.toString().split('.').pop().length) : (0);
        switch(decimalLenght) {
            case 1:
                if(+val > 0.1) {
                    $input.val((parseFloat((+val*10) - 0.1*10)/10).toFixed(1));
                }
                break;
            case 2:
                if(+val > 0.01) {
                    $input.val((parseFloat((+val*100) - 0.01*100)/100).toFixed(2));
                }
                break;
        }
        return false;
    });

    $(document).delegate('#filterParams .d-inc', 'click',function () {
        var $input = $(this).parent().find('input');
        var val = $input.val();
        var decimalLenght = (val.toString().includes('.')) ? (val.toString().split('.').pop().length) : (0);
        switch(decimalLenght) {
            case 1:
                $input.val((parseFloat((+val*10) + 0.1*10)/10).toFixed(1));
                break;
            case 2:
                $input.val((parseFloat((+val*100) + 0.01*100)/100).toFixed(2));
                break;
        }
        return false;
    });
    /*-----End Увеличение и уменьшение допусков размерав в каталоге----*/

    /*Добавления в корзину на стр. Быстрый заказ*/

    $('.fast-basket-count').change(function(e){
        var input = $(this);
        $.ajax({
            url: "/basket/changetovar/" + input.attr("prod_id") +"/" + input.val(),
            beforeSend: function(){
                input.css('display', 'none');
				input.parent().find("span").css('display', 'none');
				input.parent().find(".floatingBarsG").addClass('yeah');
            },
            success: function(msg) {
				if(input.val() == '') {
					input.val("0");
				}
                $(".cart").html(msg);
				input.parent().find("span").css('display', 'inline-block');
                input.css('display', 'block');
				input.parent().find(".floatingBarsG").removeClass('yeah');
            }
        });
    });
    $(document).delegate('.fast-basket-row .d-dec', 'click', function () {
        var $input = $(this).parent().find('input'),
            val = parseInt($input.val()) - 1;
        $input.val(val < 0 ? 0 : val);
        $input.change();
        return false;
    });
    $(document).delegate('.fast-basket-row .d-inc', 'click',function () {
        var $input = $(this).parent().find('input'),
            val = parseInt($input.val()) + 1;
        $input.val(val);
        $input.change();
        return false;
    });


    /*---------PopUp окно при покупки товаров---------------*/
    $(document).delegate('.t-dec', 'click', function () {
        var $input = $(this).parent().find('input');
        if(parseInt($input.val()) <= 1){
            $input.val("1");
            return false;
        }else{
            $input.val(parseInt(($input.val()*10) - 1*10)/10);

        }
        $input.change();
        return false;
    });
    $(document).delegate('.t-inc', 'click',function () {
        var $input = $(this).parent().find('input');
        $input.val(parseInt(($input.val()*10) + 1*10)/10);
        $input.change();
        return false;
    });
    /*---------End PopUp окно при покупки товаров----------*/
	/*3D VIEW*/
	$('.button-3d-view').click(function () {
		$(this).parent().find('.view-3d-html5').css('display','block');
		$(this).parent().find('#myfond_gris').css('display','block');
	});
	$('.mymagicoverbox_fermer').click(function () {
		$(this).parent().parent().find('#myfond_gris').css('display','none');
		$(this).parent().css('display','none');
	});
	$('#myfond_gris').click(function () {
		$(this).css('display','none');
		$(this).parent().find('.view-3d-html5').css('display','none');
	});
	/*END 3D VIEW*/
	$('.small-cart').hover(function() {
		$('.small-cart .p-rows').fadeIn(250);
	}, function(){
		if( ! small_cart_input_focus ){
			$('.small-cart .p-rows').fadeOut(250);
		}
	});
	$(document).delegate('.small-cart input.count', 'focus', function(){
		small_cart_input_focus = true;
	});
	$(document).delegate('.small-cart input.count', 'focusout', function(){
		small_cart_input_focus = false;
		$('.small-cart .p-rows').fadeOut(250);
	});

    $(window).click(function() {
        $('.langs .langs-list').addClass('hidden');
    });

    $('.langs .langs-list, .langs .current').click(function(event){
        event.stopPropagation();
    });

    $('.langs .current').click(function(event){
        $('.langs .langs-list').toggleClass('hidden');
    });

    setHeaderMenuActiveClass();

    if($('.vi-operator-col').length > 0){
        //проверка и установка количества необработанных заявок
        ajaxSetNumbers();
        setInterval(function(){
            ajaxSetNumbers();
        }, 10000);
    }


    $('.products-list-collapsed').click(function(e){
        e.preventDefault();
        var hidden_tr = $(this).prev('table.products-list').find('tr:hidden').not('.storage-0');
        if(hidden_tr.length > 0){
            hidden_tr.show();
            $(this).find('a span').html(getT('Скрыть'));
            $(this).find('a i').addClass('hidden');
        }else{
            $(this).prev('table').find('tr').not('.storage-0').not('tr:first-child').hide();
            $(this).find('a span').html(getT('Показать все'));
            $(this).find('a i').removeClass('hidden');
        }
    });

    // скрыть склады с нулевыми остатками (заказчик просил оставить в html коде и скрыть через JS)
    $('.storage-0').hide();

    // показать "Нет в наличии" для товаров, где по всем скаладам остаток 0
    $('table.storage').not(':has(.storage-1)').append('<tr><td colspan=2>'+getT('Нет в наличии')+'</td></tr>');

    $('.oe-o-show-hide').click(function(e){
        e.preventDefault();
        var blk = $('.oe-o-collapsed');
        if(blk.is(':hidden')){
            blk.show();
            $(this).html(getT('Скрыть'));
        }else{
            blk.hide();
            $(this).html(getT('Показать все'));
        }
    });
    $('.oe-n-show-hide').click(function(e){
        e.preventDefault();
        var blk = $('.oe-n-collapsed');
        if(blk.is(':hidden')){
            blk.show();
            $(this).html(getT('Скрыть'));
        }else{
            blk.hide();
            $(this).html(getT('Показать все'));
        }
    });

    // Выбор города в шапке сайта
    $('.city-select-link').click(function(e){
        var city_code = $(this).attr('city_code');
        var s = $('.city-selector');
        updateCityInfo(city_code);
        s.hide();
        s.html('');
        $('#cards-data .city-select-name').each(function(e){
            s.append('<a city_code="' + $(this).closest('.city-select').attr('city_code') + '">' + $(this).html() + '</a>');
        });
        s.show();

    });

    var cookie_city_code = readCookie('city_code');
    if(cookie_city_code && $('.city-selector').length > 0){
        updateCityInfo(cookie_city_code);
    }

    $(document).delegate('.city-selector a', 'click', function(e){
        var city_code = $(this).attr('city_code');
        updateCityInfo(city_code);
        $('.city-selector').hide();
        createCookie('city_code', city_code, 360);
    });

    function updateCityInfo(city_code){
        var selected = $('.city-select[city_code=' + city_code + ']');
        var ringo = selected.find('.vcard-extended').attr('ringostat');
        var df = $('.choose-city-contacts .tel-select').attr('class');
        df = df.replace(/ringo-[a-z]*/g, '');
        $('.choose-city-contacts .tel-select').attr('class',df);
        $('.choose-city-contacts .city-select-link').html(selected.find('.city-select-name').html());
        $('.choose-city-contacts .tel-select').html(selected.find('.tel .value').html());
        $('.choose-city-contacts .tel-select').addClass(ringo);
        $('.choose-city-contacts .schedule').html(selected.find('.city-select-schedule').html());
    }

    $(document).mouseup(function (e){
        var container = $(".city-selector");

        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0){ // ... nor a descendant of the container
            container.hide();
        }
    });

    // new city switcher
    $('.city-switcher a').click(function(e){
        var phone = $('.info-location .phone');
        $('.info-location .active-city').text('г.'+$(this).text()+',');
        $('.info-location .address').text($(this).data("address"));
        phone.text('Тел. '+$(this).data("phone"));
        phone.removeClass();
        phone.addClass('phone '+ $(this).data("class"));
        createCookie('city_code_new', $(this).data("class"), 360);
    });

    function updateCityInfoNew(cookie_city_code_new){
        var selected = $('.city-switcher a[data-class=' + cookie_city_code_new + ']');
        var phone = $('.info-location .phone');
        $('.info-location .active-city').text('г.'+selected.text()+',');
        $('.info-location .address').text(selected.data("address"));
        phone.text('Тел. '+selected.data("phone"));
        phone.removeClass();
        phone.addClass('phone '+ selected.data("class"));
    }
    var cookie_city_code_new = readCookie('city_code_new');

    if(cookie_city_code_new && $('.city-switcher').length > 0){
        updateCityInfoNew(cookie_city_code_new);
    }
    //Загрузка всех блоков, которые подгружаются через AJAX
    $(".ajax-load-page").each(function(){
        loadAjaxSilent($(this).attr('url'), $(this).attr('data'), $(this), $(this).attr('success'), $(this).attr('loader'));
    });
    //Клик на всю строчку в таблице вызывает переход на страницу, кот. указана в параметре url
    $('tr.tr-link').click(function(){
        var url = $(this).attr('url');
        window.location = url;
    });

    //Подключить скрипты для всплывающей формы "Задать вопрос"
    var scrpt = document.createElement('script');
    scrpt.src='/j/jivositems.js';
    document.head.appendChild(scrpt);
    //Скрыть для маленьких окон
    if( $(window).width() < 1073 ){
        $( "[url='/ajax/jivosite']" ).addClass( 'hidden' );
    }
    $( window ).resize(function() {
        if( $(window).width() < 1073 ){
            $( "[url='/ajax/jivosite']" ).addClass( 'hidden' );
        }
        else{
            $( "[url='/ajax/jivosite']" ).removeClass( 'hidden' );
        }
    });

    //При редактировании менеджера, в случае выбора статуса "Уволен", отобразить дату увольнения
    $('.managerForm select[name=field-status]').change(function(){
        if ($(this).val() == 'fired'){
            $('div[id=fired-date]').removeClass('hidden');
        } else {
            $('div[id=fired-date]').addClass('hidden');
        }
    });


    //Галочка "Уведомлять по смс" в кабинете клиента
    $('input[name=sms_notify]').change(function(){
        loadAjax('/c/office/ajax/sms_notify', $('form[name=sms_notify]').serializeArray(), $('#ajax-loader'));
    });

    //Календарь
    $('#fdate, #date_from, #date_to' +
        ', #date_from_byquery, #date_to_byquery' +
        ', #date_from_byquery_2, #date_to_byquery_2' +
        ', #date_from_byclient, #date_to_byclient' +
        ', #date_from_bysales, #date_to_bysales' +
        ', #date_from_miss, #date_to_miss').datepicker({
        dateFormat: 'dd.mm.yy',
        showButtonPanel: true,
        maxDate: 0
    });

    // ТОРГОВЫЕ ПРЕДСТАВИТЕЛИ > ПОИСК КЛИЕНТОВ
    $('#sm-search-user').find('form').submit(function(){
       var data = $('#sm-search-user form').serialize();
        console.log(data);
        $.ajax({
            url: '/c/sm_search/ajax',
            type: 'POST',
            data: data,
            beforeSend: function() {
                $("#sm-search-user .data").html('<div style="text-align: center;"><img src="/i/ajax-loader.gif"></div>');
            },
            success: function(result){
                $("#sm-search-user .data").html(result);
            }
        });
        return false;
    });
    //ВКЛАДКИ ЛОГ ПОИСКА

    //Инициализация вкладок jQuery
    //activate вызывается при переключении вкладок
    var activeSearchLogTab = parseInt($('#search-log-tabs').attr('active'));
    $('#search-log-tabs').tabs({active: activeSearchLogTab, activate:function(event, ui){
        ui.oldPanel.find('.data').html('');
        loadTab(ui.newPanel.attr('ajax-url'), ui.newPanel.find('form'));}});

    //Функция загрузки данных для вкладки
    function loadTab(url, form){
        if (url == undefined)
            return;

        var data;
        if (form != undefined)
            data = $(form).serializeArray();

        dataObj = $('[ajax-url="' + url + '"] div.data');

        loadAjax(url, data, dataObj); //функция описана ниже
    }

    //При загрузке страницы загрузить AJAX для активной вкладки
    loadTab($('#search-log-tabs .ui-tabs-panel[ajax-url]').attr('ajax-url'));

    //Обработка формы активной вкладки
    $('#search-log-tabs').find('form').submit(function(){
        loadTab($(this).closest('div[ajax-url]').attr('ajax-url'), $(this));
        return false;
    });

    //ПЛЮС-МИНУС: отображение таблицы детализации для лога поиска при группировке по запросу или по клиенту
    $('.plus-minus').live('click', function(){
        if (!$(this).hasClass('minus')){ //Раскрыть
            $(this).addClass('minus');

            panel = $('#search-log-tabs .ui-tabs-panel[ajax-url]'); //текущая открытая вкладка

            var col_span_num = panel.attr('id') == 'sl-by-query-2' ?
                ( $(this).attr('q').indexOf(':::') == -1 ? 8 : 7 )
                : 3;

            $(this).parent().parent().after('<tr><td colspan="' + col_span_num + '"></td></tr>'); //Это <tr>
            obj = $(this).parent().parent().next().find('td'); //созданная строка

            loadAjax(
                panel.attr('ajax-url'),
                panel.find('form').serializeArray().concat({name: "query", value: $(this).attr('q')}), obj);
        }else{ //Скрыть
            $(this).removeClass('minus');
            $(this).parent().parent().next().remove();
        }
    });

	$(".faq h3").click(function(){
		$(this).toggleClass("active").next().toggle();
	});

	//IE hacks
    if ( $.browser.msie && parseInt($.browser.version) == 6){
	    $("body").prepend("<div class='noie'><p>Ваш браузер устарел</p><div>");
    }

	$("form").submit(function(e) {
		var fail = false;
		$(this).find("[required=required]").each(function(index, domEle){
			if($(domEle).val() == ""){
				$(domEle).addClass("error");
				fail = true;
			} else {
				$(domEle).removeClass("error");
			}
		});
		if(fail)
			return false;
	});

	$("[required=required]").change(function(){
			if($(this).val() == ""){
				$(this).addClass("error");
			} else {
				$(this).removeClass("error");
			}
		});

	//suggestion iterator
	var curitem = -1;

	$(document).keydown(function(e) {
		if(e.which == 27) {
			$("#suggestion").hide();
			curitem = -1;
		}
	});

	$(document).click(function(e){
		if (!$("#suggestion").is(".hover")){
			$("#suggestion").removeClass("hover");
			$("#suggestion").hide();
			curitem = -1;
		}
	});

	$(".kitparams input").bind("click keydown change mouseleave mouseout", function(){
		var text = $(this).val() + '';
		var regex=/\,/gi;
        var replaceWith ='.';
        text = text.replace(regex,replaceWith);
		var regex=/[^0-9\.]/gi;
        var replaceWith ='';
        text = text.replace(regex,replaceWith);
		var regex=/^(\d+\..*)\./gi;
        var replaceWith ='$1';
        text = text.replace(regex,replaceWith);
		$(this).val(text);
	});

	$("#suggestion").mouseenter(function(e){
			$(this).addClass("hover");
		}).mouseleave(function(e){
			$(this).removeClass("hover");
		});

	$(".suggitems").live("mouseenter", function(){
		$(".suggitems").removeClass("active");
		curitem = parseInt($(this).attr("id"));
		$(this).addClass("active");
	}).live("mouseleave", function(){
		$(this).removeClass("active");
	});

    $('#b-more').click(function(){
        $(this).addClass('hidden');
        $('#b-hide').removeClass('hidden');
        $('#collapsed-descr').removeClass('collapsed-height');
        $('#c-dots').addClass('hidden');
    });

    $('#b-hide').click(function(){
        $(this).addClass('hidden');
        $('#b-more').removeClass('hidden');
        $('#collapsed-descr').addClass('collapsed-height');
        $('#c-dots').removeClass('hidden');
    });

	$("#closesuggestion").live("click", function(){
		$("#suggestion").hide();
	});


	$(".suggitems").live("click", function(){
		window.location = "/" + $(this).attr("tovarId");
	});

    $("input.count").live('keydown change', function() {
        if ($(this).data('timeout'))
            clearTimeout($(this).data('timeout'));
        var input = $(this);
        $(this).data('timeout', setTimeout(function() {
            if (isInt(input.val())) {
                var price = ($('#r-price').html()*10)/10;
                var count = parseInt(input.val()*10)/10;
                $('#t-price').css('display','none');
                if(! $('#sum-price').closest('.ask-price-block').length ) {
                    $('#sum-price').html(price*count);
                }
                if($("input[name='prod_count']")){
                    $("input[name='prod_count']").val(count);
                }
                if(!input.hasClass("c-pre-order")){
                    $.ajax({
                        url: "/basket/changetovar/" + input.attr("prod_id") +"/" + input.val(),
                        success: function(msg) {
                            if ($(".header-cart").length) {
                                $(".cart-container").html(msg);
                                updateCountCart();
                                getCartForOrderPage();
                            } else {
                                $(".cart").html(msg);
                            }
                        }
                    });
                }
            }
        }, 500));
    });
    $("#showLoginWindow").click(function() {
        $("#loginWindow").removeClass("hidden");
	    if ($.browser.msie && parseInt($.browser.version) < 9){
			$("body").addClass("ieto9");
	}
        return false;
    });

    $("#showNewsWindow").click(function() {
        $(".manageNews").attr("action", "/news/add");
        $("#manageTitle").html("Добавить новость");
        $("#manageButton").html("Добавить");
        $("#field-title").attr("value", "");

        $("#text").attr("value", "");
        var now = new Date();
        var month = now.getMonth()+1;
        month = "" + month;
        if (month.length==1){
            month = "0" + month;
        }
        var date = now.getDate();
        date = "" + date;
        if (date.length==1){
            date = "0" + date;
        }

        $("#field-date").attr("value", date + "." + month + "." + now.getFullYear());
        $().setupCk();
        return false;
    });

    $(".modifynews").click(function() {
        $(".manageNews").attr("action", "/news/modify");
        $(".modifyId").attr("value", $(this).attr("newsId"));
        $("#manageTitle").html("Редактировать новость");
        $("#manageButton").html("Сохранить");
        $("#field-title").attr("value", $(this).attr("titletext"));
        $("#field-date").attr("value", $(this).attr("date"));
        $("#text").attr("value", $(this).attr("text"));
        $().setupCk();
         return false;
    });

    $("#field-date").mask("99.99.9999");


    $(".hideNewsWindow").click(function() {
        $("#newsWindow").addClass("hidden");
	    $("body").removeClass("ieto9");
        $('#text').ckeditorGet().destroy();
        return false;
    });

    $("#hideLoginWindow").click(function() {
        $("#loginWindow").addClass("hidden");
	    $("body").removeClass("ieto9");
        return false;
    });

    $("#oesearch").click(function() {
        $("#filterParams").addClass("hidden");
        $("#filterCode").removeClass("hidden");
        $('#oesearch').addClass('active');
        $('#paramssearch').removeClass('active');
        return false;
    });

         $("#test").click(function() {

		 });
	$("#payment_button").click(function() {
    	if($(".page-payment #field-fio").val()==''|| $(".page-payment #field-phone").val()==''||
    	$(".page-payment #field-bill").val()==''||$(".page-payment #field-bsum").val()==''||$("#type_card option:selected").val()=='') 	{
    		alert('Небходимо заполнить все данные формы'); return false;
    	}
    	$('.page-payment #field-sum').removeAttr('disabled');
		var postdata = $("#payment_system").serialize();
		$('.page-payment #field-sum').attr('disabled','disabled');
		var action = $("#payment_system").attr("action");
		url=action+'?'+postdata;

		$.post(url, function(data) {
			var datapayments = $.parseJSON(data);
			   $("#dinform").html('<form action="'+datapayments.url+'" method="POST">' +
    		   '<input type="hidden" name="operation_xml" value="' + datapayments.operation_xml + '">' +
    		   '<input type="hidden" name="signature" value="' + datapayments.signature + '">' +
    		   '</form>');
    		   $('#dinform form').submit();
               //alert(datapayments.url);
 		});
	});
	// filter input for paysystem
	function banksum(){
		 var bsum =  parseFloat($(".page-payment #field-bsum").val());
		 var fee = parseFloat($("#type_card option:selected").val());
		 var sum   = bsum*fee;
		if(isNaN(sum))
			$(".page-payment #field-sum").val('');
		else
			$(".page-payment #field-sum").val(sum.toFixed(2));
		//alert(bsum+' '+fee) ;
	}
	 $(".page-payment #field-fio").filter_input({regex:'[а-яА-Яa-zA-Z ]'});
	 $(".page-payment #field-phone").filter_input({regex:'[0-9\+]'});
	 $(".page-payment #field-bsum").filter_input({regex:'[0-9\.\,]'});
	 $(".page-payment #field-bill").filter_input({regex:'[0-9а-яА-Яa-zA-Z\-_]'});
	// $(".page-payment #field-email").filter_input({regex:'[0-9A-Za-z\.\,]'});
 	$(".page-payment #field-bsum").live('keyup', function() {

	 	  banksum();
      });
 	$(".page-payment #type_card").change(function() {

	 	  banksum();
      });


    $().setKittype();
	if (typeof curkittype != 'undefined'){
		$("#kittype").find("option[value=\"" + curkittype +"\"]").attr("selected", "selected");
	}

    $("#category-kit").change(function() {
        $().setKittype();
    });


	$("#filterCode form").submit(function(e) {
		e.preventDefault();
		if ($("#field-code").val() !== ""){
            window.location = "/catalog?oe=" + $("#field-code").val();
		}
		else
			return false;
	});

    $(".buyButton").live("click", function(e) {
        data = $.ajax({
            url: "/basket/addtovar/" + $(this).attr("prod_id"),
            success: function(msg) {
                if ($(".header-cart").length) {
                    $(".cart-container").html(msg);
                    updateCountCart();
                } else {
                    $(".cart").html(msg);
                }
            }
        });
        return false;
    });

    //$(".ordButton").live("click", function(e) {
    //    data = $.ajax({
    //        url: "/basket/addtovar/" + $(this).attr("prod_id"),
    //        success: function(msg) {
    //            $(".cart").html(msg);
    //        }
    //    });
    //    return false;
    //
    //
    //});


    $(".cart .deleteButton, #cancelAddProduct").live("click", function(e) {
        $.ajax({
            url: "/basket/deletetovar/" + $(this).attr("prod_id"),
            success: function(msg) {
                if ($(".header-cart").length) {
                    $(".cart-container").html(msg);
                    updateCountCart();
                    getCartForOrderPage();
                }else{
                    $(".cart").html(msg);
                }
            }
        });
        return false;
    });


    $(".header-cart .remove").live("click", function(e) {
        $.ajax({
            url: "/basket/deletetovar/" + $(this).attr("prod_id"),
            success: function(msg) {
                $(".cart-container").html(msg);
                updateCountCart();
                getCartForOrderPage();
            }
        });
        return false;
    });

    $(".header-cart input.countNewCard").live('keydown change', function() {
        if ($(this).data('timeout'))
            clearTimeout($(this).data('timeout'));
        var input = $(this);
        $(this).data('timeout', setTimeout(function() {
            if (isInt(input.val())) {
                var price = ($('#r-price').html()*10)/10;
                var count = parseInt(input.val()*10)/10;
                $('#t-price').css('display','none');
                $('#sum-price').html(price*count);
                if($("input[name='prod_count']")){
                    $("input[name='prod_count']").val(count);
                }
                if(!input.hasClass("c-pre-order")){
                    $.ajax({
                        url: "/basket/changetovar/" + input.attr("prod_id") +"/" + input.val(),
                        success: function(msg) {
                            $(".cart-container").html(msg);
                            updateCountCart();
                            getCartForOrderPage();
                        }
                    });
                }
            }
        }, 500));
    });

    $(document).delegate('.header-cart .minus', 'click', function () {
        var $input = $(this).parent().find('input');
        if(parseInt($input.val()) <= 1){
            $input.val("1");
            return false;
        }else{
            $input.val(parseInt(($input.val()*10) - 1*10)/10);

        }
        $input.change();
        updateCountCart();
        return false;
    });

    $(document).delegate('.header-cart .plus', 'click',function () {
        var $input = $(this).parent().find('input');
        $input.val(parseInt(($input.val()*10) + 1*10)/10);
        $input.change();
        updateCountCart();
        return false;
    });

    function updateCountCart() {
        var count = $('.header-cart .count-cart-tovar').val();
        if(count > 0){
            $('.header-cart .count-cart').show();
            $('.header-cart .count-cart').text(count);
        }else{
            $('.header-cart .count-cart').hide();
        }
    }

    $("#delProduct").live("click", function(e) {
        $.ajax({
            url: "/basket/deletetovar/" + $(this).attr("prod_id"),
            success: function(msg) {
                $(".cart").html(msg);
            }
        });
    });

    $("#cancelAddProduct").live("click", function(e) {
        e.preventDefault();
        $('#ask-dialog').remove();
    });

	$(".qq-uploader .deleteButton").live("click", function(e) {
        $(this).parent().remove();
        return false;
    });

    $.ajax({
        url: "/basket/gettovar",
        success: function (msg) {
            if ($(".header-cart").length) {
                $(".cart-container").html(msg);
                updateCountCart();
            } else {
                $(".cart").html(msg);
            }
        }
    });

    /**
     * Only page order in site steering and autosteering
     */
    getCartForOrderPage();

    function getCartForOrderPage() {
        if ((window.location.pathname === '/order' || window.location.pathname === '/ua/order') && $(".header-cart").length) {
            $.ajax({
                url: "/basket/gettovar/order",
                success: function (msg) {
                    $(".cart").html(msg);
                }
            });
        }
    }
    //FancyBox
    $("a.enlarge").fancybox({
        'opacity'        : true,
        'overlayShow'    : false,
        'transitionIn'    : 'elastic',
        'transitionOut'    : 'none',
        'hideOnContentClick' :true
    });

	//qqHelper
	$("form#podzakaz, form#skladinfo").submit(function() {
		var files = new Array();
		$(".qq-upload-file").each(function() {
			files.push($(this).text());
		});
		$("#files").attr("value", files.join(","));
	});

	if ($("#file-uploader").length != 0){
		createUploader();
	}

    $('#hidden-text-link').click(function(){
         $('#hidden-text').toggle("highlight");
    });

/*ask-dialog*/
    $(document).delegate('.ask-dialog', 'click', function(e){
        e.preventDefault();
        var success = $(this).attr('success');

        var request = $.ajax({
            url: '/ajax/ask_dialog',
            data: {
                url: $(this).attr('href'),
                msg: $(this).attr('ask'),
                askButtons: $(this).attr('askButtons'),
                prod_id: $(this).attr('prod_id'),
                prod_count: $(this).attr('prod_count'),
                url_back: window.location.href
            }
        });

        request.done(function(data){
            $('header').after(data);
            eval(success);
        });
    });

    $("#ask-dialog").live('mouseenter', function(e){
        maskPhone('#field-phone');
    });



    $(document).delegate('#ask-dialog #ask-dialog-no', 'click', function(e){
        e.preventDefault();
        $('#ask-dialog').remove();
    });

    $(document).delegate('#ask-dialog form', 'submit', function(e){
        if ($(this).attr("id") != "msg-order-form"){
            e.preventDefault();
            $('.formDefaultClick').trigger('click');
        }

    });

    $(document).delegate('#ask-dialog form .cancel', 'mouseenter', function(e){
        $('#cancelLabel').show();
    });
    $(document).delegate('#ask-dialog form .cancel', 'mouseleave', function(e){
        $('#cancelLabel').hide();
    });

    $(document).delegate('#ask-dialog #ask-dialog-proceed', 'click', function(e){
        e.preventDefault();
        var prodId = $('#ask-dialog input.askCount').attr('prod_id');
        var buyBtn = $('.buyButton[prod_id="' + prodId + '"]');
        buyBtn.after('<div class="vi-btn-1"><a  href="/order">'+getT('В корзине')+'</a></div>');
        buyBtn.remove();
        $('#ask-dialog').remove();
    });


    /*comments add by ajax-form*/
    $(document).delegate('.add-comment', 'click', function(e){
        e.preventDefault();
        var id = $(this).attr('id'),
            type = $(this).attr('page-type');

        var request = $.ajax({
            url: '/ajax/comment_form',
            data: {
                record_id:   id,
                page_type: type
            }
        });

        request.done(function(data){
            $('header').after(data);

            $().setupCkComment();
        });

    });

    /*В случае, если добавляются комментарии на search_log, то добавление комментариев идет через ajax,
    * после чего не обновляется вся страница, а только часть с кодами*/
    $(document).delegate('form.manageComment', 'submit', function(e){

        if ($(this).find('input[name=field-page_type]').val() != 'miss_searchlog')
            return;

        e.preventDefault();

        var request = $.ajax({
            url: '/comments/add',
            data: $(this).serialize()
        });
        request.done(function(data){
            $('#sl-by-query-miss input[type=submit]').trigger('click'); // Кнопка "Применить" на фильтре
            $('.hideWindow').trigger('click'); // "Крестик" - закрыть окно
        });
    });


    $(document).delegate('.hideWindow', 'click', function(e){
        e.preventDefault();
        $("body").removeClass("ieto9");
        //$('#field-mess').ckeditorGet().destroy();
        $(this).closest('.popup').remove();

    });
    /*Manager's coments adds*/
    $('#showCommentsLink a').click(function(){

        var comments = $('.td-comments .comments');

        if (comments.hasClass('hidden')){

            comments.removeClass('hidden');

            $('.th-comments').attr('style', 'width: 200px');

            $(this).html(getT('Скрыть комментарии'));

        } else {

            comments.addClass('hidden');

            $('.th-comments').removeAttr('style');

            $(this).html(getT('Показать комментарии'));

        }
    });

    if ( $('#showCommentsLink').attr('visible') == 'yes'){
        $('#showCommentsLink a').trigger('click');
    }

/* end manager's comments */
    /* Show statistic channel manager`s in /c/orders*/
	$('#showChStatisticLink a').click(function(){
		if($('#ChannelsStatistic').css("display")=="block"){
			$('#ChannelsStatistic').css("display", "none");
			$('#showChStatisticLink a').html(' Показать статистику по каналам продаж');
		}
		else{
			$('#ChannelsStatistic').css("display", "block");
			$('#showChStatisticLink a').html('Скрыть статистику по каналам продаж');
		}
	});
	$('#showChStatisticOrder a').click(function(){
		if($('#ChannelsStatisticOrder').css("display")=="block"){
			$('#ChannelsStatisticOrder').css("display", "none");
			$('#showChStatisticOrder a').html(' Показать статистику по заказам');
		}
		else{
			$('#ChannelsStatisticOrder').css("display", "block");
			$('#showChStatisticOrder a').html('Скрыть статистику по заказам');
		}
	});
	$('#showChStatisticOtkaz a').click(function(){
		if($('#ChannelsStatisticOtkaz').css("display")=="block"){
			$('#ChannelsStatisticOtkaz').css("display", "none");
			$('#showChStatisticOtkaz a').html(' Показать статистику по отказам');
		}
		else{
			$('#ChannelsStatisticOtkaz').css("display", "block");
			$('#showChStatisticOtkaz a').html('Скрыть статистику по отказам');
		}
	});
	var owl = $("#owl-demo");
/* OWL CAROUSEL */
	owl.owlCarousel({

		itemsCustom: [
			[0, 1],
			[450, 2],
			[600, 2],
			[700, 2],
			[1000, 3],
			[1200, 4],
			[1400, 4],
			[1600, 4]
		],
		pagination: false,
		autoPlay: true,
		autoPlayTimeout: 0,
		autoPlaySpeed: 1000,
		navigation: true,
		navigationText: [
			"<span class='vi-left'></span>",
			"<span class='vi-right'></span>"
		]

	});
    var owl1 = $("#owl-demo1");

    owl1.owlCarousel({

        itemsCustom: [
            [0, 1],
            [450, 2],
            [600, 2],
            [700, 2],
            [1000, 2],
            [1200, 4],
            [1400, 4],
            [1600, 4]
        ],
		pagination: false,
		autoPlay: true,
		autoPlayTimeout: 0,
		autoPlaySpeed: 1000,
        navigation: true,
        navigationText: [
            "<span class='vi-left'></span>",
            "<span class='vi-right'></span>"
        ]

    });

    var owCpage = $("#custom-page-slider");

    owCpage.owlCarousel({

        itemsCustom: [
            [0, 1],
            [450, 1],
            [600, 1],
            [700, 1],
            [1000, 1],
            [1200, 1],
            [1400, 1],
            [1600, 1]
        ],
        pagination: true,
		autoPlay: true,
		autoPlayTimeout: 0,
		autoPlaySpeed: 1000,
        navigation: true,
        navigationText: [
            "<span class='vi-left'></span>",
            "<span class='vi-right'></span>"
        ]

    });

    $('.vi-prim-agr .label').on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).nextUntil('content').toggleClass('vi-dis-blck');
        $(this).toggleClass('open-cont');
    });
    $('.vi-prim-agr1 .label').on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).nextUntil('content1').toggleClass('vi-dis-blck');
        $(this).toggleClass('open-cont');
    });

	var owl2 = $("#owl-demo2");

	owl2.owlCarousel({

		itemsCustom: [
			[0, 1],
			[450, 1],
			[600, 1],
			[700, 1],
			[1000, 1],
			[1200, 1],
			[1400, 1],
			[1600, 1]
		],
		pagination: true,
		autoPlay: true,
		autoPlayTimeout: 0,
		autoPlaySpeed: 2000

	});

	var owl3 = $("#owl-demo3");

	owl3.owlCarousel({

		itemsCustom: [
			[0, 1],
			[450, 1],
			[600, 1],
			[700, 1],
			[1000, 2],
			[1200, 2],
			[1400, 2],
			[1600, 2]
		],
		pagination: true,
		autoPlay: true,
		autoPlayTimeout: 0,
		autoPlaySpeed: 2000

	});



	function setEqualHeight(columns)
	{
		var tallestcolumn = 0;
		columns.each(
			function()
			{
				currentHeight = $(this).height();
				if(currentHeight > tallestcolumn)
				{
					tallestcolumn = currentHeight;
				}
			}
		);
		columns.height(tallestcolumn);
	}

	setEqualHeight($(".small-links-images > a > span"));

	/*END OWL*/
	/*FIX BOOTSTRAP SUBMENU*/
	$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(this).parent().toggleClass('open');
		$(this).parent().find("ul").parent().find("li.dropdown").toggleClass('open');
	});
	/*END FIX*/
	/*FOTORAMA*/
	$('.fotorama').on('fotorama:ready', function (e, fotorama) {

		$('.vi-big-image').css('visibility','visible');

		$(document).delegate('.fotorama__stage__frame.fotorama__active', 'click', function(e){
			if( ! $(this).hasClass('fotorama__stage__frame--video')){
				e.stopPropagation();
				fotorama.toggleFullScreen();
			}
		});

	});
	/*END FOTORAMA*/
    /* End Show statistic channel manager`s in /c/orders*/

    if($(".category-description").outerHeight() > 154 ){
        $(".cat-select").removeClass('hidden');
        $(".category-description").addClass('cat-hidden');
    }
     if($(".index-description").outerHeight() > 154 && !$(".index-description").hasClass('hide_read_more')){
            $(".ind-select").removeClass('hidden');
            $(".index-description").addClass('ind-hidden');
        }







/*скрывать "Задать вопрос", если окно браузера меньше определенного размера */
    $( window ).resize(function() {
        if( $(window).width() < 1073 ){
            $( "[url='/ajax/jivosite']" ).addClass( 'hidden' );
        }
        else{
            $( "[url='/ajax/jivosite']" ).removeClass( 'hidden' );
        }
    });

    $(document).delegate('#feedback-field-city', 'change', function(){

        $('fieldset .text-info').addClass('hidden');

        if ($(this).val() == '1'){

            $('#belgorod-info').removeClass('hidden');

        }

        if ($(this).val() == '2'){

            $('#rostov-info').removeClass('hidden');

        }

    });

    $(document).delegate('.registration-service-form button[type=submit]', 'click', function(e){

        if ($('#feedback-field-city').val() === ''){
            e.preventDefault();
            $('#feedback-field-city').showNiceValidationMessage('Выберите город');
        } else if ($('#feedback-field-name').val() === ''){
            e.preventDefault();
            $('#feedback-field-name').showNiceValidationMessage('Пожалуйста, введите имя');
        } else if ($('#feedback-field-phone').val() === ''){
            e.preventDefault();
            $('#feedback-field-phone').showNiceValidationMessage('Введите телефон');
        }

    });

    $('.status-option').change(function(){
        if($(this).val() == 3){
            $('.status-reason').show();
            $('.status-reason-label').show();
        }else{
            $('.status-reason').hide();
            $('.status-reason-label').hide();
        }
    });

    $('#status-form').submit(function(e){

        if($('.status-option').val() == 3 && $('.status-reason').val() == 0){
            alert('Укажите причину отказа');
            e.preventDefault();
        }

        if($('.status-option').val() != 3){
            $('.status-reason').val(0);
        }

    });

    $('.catalog_view a:not(.active)').click(function(){

        $('#catalog_view_form input[name=catalog_view]').val($(this).attr('v'));
        $('#catalog_view_form').submit();

    });

    $(document).delegate('.prop-pi', 'change', function(){
        if($(this).val() == 'sort-az' || $(this).val() == 'sort-za'){
            $('.prop-pi').not(this).each(function(){
                if($(this).val() == 'sort-az' || $(this).val() == 'sort-za'){
                    $(this).val('all');
                }
            });
        }
    });


//global vars
    var form = $("#newLoginForm");
    var username = $("#newLogin");
    var password = $("#newPassword");

//On Submitting
    form.submit(function () {
        username.removeClass('error');
        password.removeClass('error');
        $(".new-form-group .red").hide();
        username.next().hide();
        password.next().hide();
        if (username.val().length == 0) {
            username.addClass('error');
            username.next().show();
            return false;
        }
        else {
            if (password.val().length == 0) {
                password.addClass('error');
                password.next().show();
                return false;
            }

            else {
                return true;
            }
        }
    });

    // var searchButtonNewHeader = $(".selection-by-vin");
    // searchButtonNewHeader.click(function () {
    //     var form = $('#searchCatalog');
    //     form.submit();
    // });
    //
    // var searchButtonNewHeaderMobile = $(".search-mobile-vin");
    // searchButtonNewHeaderMobile.click(function () {
    //     var form = $('#searchCatalogMobile');
    //     form.submit();
    // });
});

$.fn.showNiceValidationMessage = function(msg) {

    var pos = $(this).position();
    var width = $(this).width();

    $(this).after("<div class='alert hidden' style='" +
        "left: " + (pos.left + width) + "px;" + "top: " + pos.top + "px;" +
        "'><div class='arrow'></div><div class='inner'>"+ msg +"</div></div>");
    $(".alert").fadeIn(300).delay(1000).fadeOut(300).queue(function(){
        //$(this).remove();
    });

};

$.fn.setupCkComment = function() {
    //$("#commentWindow").removeClass("hidden");
    $(".hideWindow").click(function(e){
        e.preventDefault();
        $("#commentWindow").addClass("hidden");
    });
    if ($.browser.msie && parseInt($.browser.version) < 9){
        $("body").addClass("ieto9");
    }
    var config = {
        toolbar:
            [
                ['Bold', 'Italic','Underline','Strike', '-', 'NumberedList', 'BulletedList', 'Link']
            ],
            resize_maxWidth: 440

    };
    //$("#field-mess").ckeditor(config);
    $(this).animate({scrollTop:0}, 'slow');

};

$.fn.setupCk = function() {
    $("#newsWindow").removeClass("hidden");
	if ($.browser.msie && parseInt($.browser.version) < 9){
		$("body").addClass("ieto9");
	}
	var config = {
		toolbar:
		[
			['Bold', 'Italic','Underline','Strike', '-', 'NumberedList', 'BulletedList', 'Link']
		]
	};
	$("#text").ckeditor(config);
	$('html, body').animate({scrollTop:0}, 'slow');

};



$.fn.setKittype = function() {
    category = $("#category-kit").val();
    $("#kittype").parent().removeClass('hidden');
    $("#field-d2, #field-d, #field-h1, #field-d2d, #field-dd, #field-h1d").removeAttr("disabled");
	$("#for-d2, #for-d, #for-h1, #for-d2d, #for-dd, #for-h1d").removeClass("disabled");
    if (category == 18) {
        $("#kittype:parent").parent().addClass('hidden');
        $().changeEnlarge("rez.jpg");
        $("#field-d2, #field-d, #field-h1, #field-d2d, #field-dd, #field-h1d").attr("disabled","disabled");
		$("#for-d2, #for-d, #for-h1").addClass("disabled");
        $("#field-d2, #field-d, #field-h1").attr("value","");
        return;
    }
    if (category == 16) {
        $().changeEnlarge("tef.jpg");
        $("#field-d2, #field-h1, #field-d2d, #field-h1d").attr("disabled","disabled");
		$("#for-d2, #for-h1").addClass("disabled");
        $("#field-d2,  #field-h1").attr("value","");
    }
    if (category == 6 || category == "")
        $().changeEnlarge("");

    $("#kittype").empty();
    $("#kittype").append($('<option value="">'+ getT('Все типы')+'</option>'));
    if (typeof kittypes == 'undefined')
        return;
    curtypes = kittypes[category];
    for (i in kittypes[category])
    {
    	if ( curtypes[i]["kittype"] != "" )
        	$("#kittype").append($('<option value="' + curtypes[i]["kittype"] + '">' + curtypes[i]["kittype"] + '</option>'));
    }


};

function createUploader(){
            var uploader = new qq.FileUploader({
                element: document.getElementById('file-uploader'),
                action: '/feedback/fileupload',
	            onComplete: function(id, fileName, response) {
		            var href = response.url;
		            $("li.qq-upload-success:last").prepend('<a class="deleteButton"></a>');
		            $("form#skladinfo").submit();
	            }
            });
        }


function isInt(x) {
   var y=parseInt(x);
   if (isNaN(y)) return false;
   return x==y && x.toString()==y.toString();
 }

function dump(arr, level) {
    var dumped_text = "";
    if (!level) level = 0;
    //The padding given at the beginning of the line.
    var level_padding = "";
    for (var j = 0; j < level + 1; j++) level_padding += " ";
    if (typeof(arr) == 'object') { //Array/Hashes/Objects
        for (var item in arr) {
            var value = arr[item];
            if (typeof(value) == 'object') { //If it is an array,
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += dump(value, level + 1);
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else { //Stings/Chars/Numbers etc.
        dumped_text = "=>" + arr + "<=(" + typeof(arr) + ")";
    }
    return dumped_text;
}

function linksret( id )
{
	$.get("/j/links.php",{ links: id },
	function( data )
	{
		$("#" + id ).append(data);
	});
}

function loadAjaxSilent(url, data, dataObj, success, loader){
    var request = $.ajax({
        url: url,
        type: 'GET',
        data: data,
        beforeSend: function(){
            if (loader == 'true'){
                dataObj.html('<div style="text-align: center;"><img src="/i/ajax-loader.gif"></div>');
            }
        }
    });

    request.success(function( msg ) {
        dataObj.html(msg);
        eval(success);
        return true;
    });
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function ajaxSetNumbers(){
    $.ajax({
        url: '/ajax/admin_requests_numbers',
        success: function(data){
            var nums = JSON.parse(data);
            if(typeof nums === 'object'){
                for (var key in nums) {
                    if (nums.hasOwnProperty(key)) {
                        if(nums[key] != 0){
                            $('#'+key).html(nums[key]);
                            $('#'+key).show();
                        }else{
                            $('#'+key).hide();
                        }
                    }
                }
            }
        }
    });
}

function setHeaderMenuActiveClass(){
    $('ul.header_menu li a').each(function(){
        if($(this).attr('href') == window.location.pathname){
            $(this).closest('ul.header_menu > li').addClass('active');
        }
    });
}
function loadAjax(url, data, dataObj){
    var request = $.ajax({
        url: url,
        type: 'GET',
        data: data,
        beforeSend: function(){
            dataObj.html('<div style="text-align: center;"><img src="/i/ajax-loader.gif"></div>');
        }
    });

    request.success(function( msg ) {
        dataObj.html(msg);
        return true;
    });

    request.fail(function( jqXHR, textStatus ) {
        alert("Извините, ошибка запроса: " + textStatus + ". Попробуйте обновить страницу или свяжитесь с менеджером");
        return false;
    });
}
//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$('.rff').each(function(){
    var form = $(this),
    btn = form.find('.btn_submit');

    form.find('.rfield').addClass('empty_field');

    // Функция проверки полей формы
    function checkInput(){
        form.find('.rfield').each(function(){
            if($(this).val() != ''){
                // Если поле не пустое удаляем класс-указание
                $(this).removeClass('empty_field');
            } else {
                // Если поле пустое добавляем класс-указание
                $(this).addClass('empty_field');
            }
        });
    }

    // Функция подсветки незаполненных полей
    function lightEmpty(){
        form.find('.empty_field').css({'border-color':'#d8512d'});
        // Через полсекунды удаляем подсветку
        setTimeout(function(){
            form.find('.empty_field').removeAttr('style');
        },1200);
    }

    setInterval(function(){
        // Запускаем функцию проверки полей на заполненность
        checkInput();
        // Считаем к-во незаполненных полей
        var sizeEmpty = form.find('.empty_field').size();
        // Вешаем условие-тригер на кнопку отправки формы
        if(sizeEmpty > 0){
            if(btn.hasClass('disabled')){
                return false;
            } else {
                btn.addClass('disabled');
            }
        } else {
            btn.removeClass('disabled');
        }
    },500);

    $(".next").click(function(){
        if(animating) return false;
        if($(this).hasClass('disabled')){
            // подсвечиваем незаполненные поля и форму не отправляем, если есть незаполненные поля
            lightEmpty();
           /* alert("Заполните все обязательные поля.");*/
            return false;
        } else {
            current_fs = $(this).parent();
            next_fs = $(this).parent().next();
            /* $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");*/
            next_fs.show();
            next_fs.css({'opacity': 1});
            current_fs.hide();
           /* $(".next").addClass('disabled');*/
            animating = false;
        }
    });
    btn.click(function(){
        if($(this).hasClass('disabled')){
            // подсвечиваем незаполненные поля и форму не отправляем, если есть незаполненные поля
            lightEmpty();
            return false;
        } else {
            // Все хорошо, все заполнено, отправляем форму
            // form.submit();
        }
    });
});

$(".previous").click(function(){

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();
    previous_fs.show();
    //hide the current fieldset with style
    previous_fs.css({'transform': 'scale('+1+')', 'opacity': 1});
    current_fs.hide();
    animating = false;
});

$(".submit").click(function(){
    return false;
});

/*** Seo->robots script */
$("#var-robots button").click(function(){
    var form = $('form[name=var_robots]');
    console.log(form.serializeArray());
    var request = $.ajax({
        url: '/c/seo_var_ajax',
        type: 'POST',
        data: form.serializeArray()
    });

    request.success(function(msg) {
        alert("Файл robots.txt сохранен!");
    });

    return false;
});
/*** End Seo->robots script */

function setActiveTab(){
    var tab_href = readCookie('active_tab');
    if(tab_href){
        var tab_el = $('.panel a[href="#' + tab_href + '"]');
        if(tab_el.length > 0){
            var parent_panel = tab_el.closest('.panel');
            parent_panel.find('.panel-heading ul > li').removeClass('active');
            parent_panel.find('.panel-body .tab-pane').removeClass('active in');
            tab_el.click();
            eraseCookie('active_tab');
        }
    }
}

// Маска для телефонов на сайте
function maskPhone(field) {
    $('.phone-country').each(function(indx, element){
        var country = $(this).find('option:selected' ).val();

        switch (country) {
            case "ru":
                $(field).mask("+7(999) 999-99-99");
                break;
            case "ua":
                $(field).mask("+38(999) 999-99-99");
                break;
            case "by":
                $(field).mask("+375(999) 999-99-99");
                break;
        }
    });

}
