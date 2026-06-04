var $ = jQuery.noConflict();

$(document).ready(function() {
    // Р’ dataTransfer РїРѕРјРµС‰Р°СЋС‚СЃСЏ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ РєРѕС‚РѕСЂС‹Рµ РїРµСЂРµС‚Р°С‰РёР»Рё РІ РѕР±Р»Р°СЃС‚СЊ div
    jQuery.event.props.push('dataTransfer');

    // РњР°РєСЃРёРјР°Р»СЊРЅРѕРµ РєРѕР»РёС‡РµСЃС‚РІРѕ Р·Р°РіСЂСѓР¶Р°РµРјС‹С… РёР·РѕР±СЂР°Р¶РµРЅРёР№ Р·Р° РѕРґРЅРё СЂР°Р·
    var maxFiles = 6;

    // РћРїРѕРІРµС‰РµРЅРёРµ РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ
    var errMessage = 0;

    // РљРЅРѕРїРєР° РІС‹Р±РѕСЂР° С„Р°Р№Р»РѕРІ
    var defaultUploadBtn = $('#uploadbtn');

    // РњР°СЃСЃРёРІ РґР»СЏ РІСЃРµС… РёР·РѕР±СЂР°Р¶РµРЅРёР№
    var dataArray = [];

    // РћР±Р»Р°СЃС‚СЊ РёРЅС„РѕСЂРјРµСЂ Рѕ Р·Р°РіСЂСѓР¶РµРЅРЅС‹С… РёР·РѕР±СЂР°Р¶РµРЅРёСЏС… - СЃРєСЂС‹С‚Р°
    $('#uploaded-files').hide();

    // РњРµС‚РѕРґ РїСЂРё РїР°РґРµРЅРёРё С„Р°Р№Р»Р° РІ Р·РѕРЅСѓ Р·Р°РіСЂСѓР·РєРё
    $('#drop-files').on('drop', function(e) {
        // РџРµСЂРµРґР°РµРј РІ files РІСЃРµ РїРѕР»СѓС‡РµРЅРЅС‹Рµ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ
        var files = e.dataTransfer.files;
        // РџСЂРѕРІРµСЂСЏРµРј РЅР° РјР°РєСЃРёРјР°Р»СЊРЅРѕРµ РєРѕР»РёС‡РµСЃС‚РІРѕ С„Р°Р№Р»РѕРІ
        if (files.length <= maxFiles) {
            // РџРµСЂРµРґР°РµРј РјР°СЃСЃРёРІ СЃ С„Р°Р№Р»Р°РјРё РІ С„СѓРЅРєС†РёСЋ Р·Р°РіСЂСѓР·РєРё РЅР° РїСЂРµРґРїСЂРѕСЃРјРѕС‚СЂ
            loadInView(files);
        } else {
            alert('Р’С‹ РЅРµ РјРѕР¶РµС‚Рµ Р·Р°РіСЂСѓР¶Р°С‚СЊ Р±РѕР»СЊС€Рµ '+maxFiles+' РёР·РѕР±СЂР°Р¶РµРЅРёР№!');
            files.length = 0; return;
        }
    });

    // РџСЂРё РЅР°Р¶Р°С‚РёРё РЅР° РєРЅРѕРїРєСѓ РІС‹Р±РѕСЂР° С„Р°Р№Р»РѕРІ
    defaultUploadBtn.on('change', function() {
        // Р—Р°РїРѕР»РЅСЏРµРј РјР°СЃСЃРёРІ РІС‹Р±СЂР°РЅРЅС‹РјРё РёР·РѕР±СЂР°Р¶РµРЅРёСЏРјРё
        var files = $(this)[0].files;
        // РџСЂРѕРІРµСЂСЏРµРј РЅР° РјР°РєСЃРёРјР°Р»СЊРЅРѕРµ РєРѕР»РёС‡РµСЃС‚РІРѕ С„Р°Р№Р»РѕРІ
        if (files.length <= maxFiles) {
            // РџРµСЂРµРґР°РµРј РјР°СЃСЃРёРІ СЃ С„Р°Р№Р»Р°РјРё РІ С„СѓРЅРєС†РёСЋ Р·Р°РіСЂСѓР·РєРё РЅР° РїСЂРµРґРїСЂРѕСЃРјРѕС‚СЂ
            loadInView(files);
            // РћС‡РёС‰Р°РµРј РёРЅРїСѓС‚ С„Р°Р№Р» РїСѓС‚РµРј СЃР±СЂРѕСЃР° С„РѕСЂРјС‹
            $('#frm').each(function(){
                this.reset();
            });
        } else {
            alert('Р’С‹ РЅРµ РјРѕР¶РµС‚Рµ Р·Р°РіСЂСѓР¶Р°С‚СЊ Р±РѕР»СЊС€Рµ '+maxFiles+' РёР·РѕР±СЂР°Р¶РµРЅРёР№!');
            files.length = 0;
        }
    });

    // Р¤СѓРЅРєС†РёСЏ Р·Р°РіСЂСѓР·РєРё РёР·РѕР±СЂР°Р¶РµРЅРёР№ РЅР° РїСЂРµРґСЂРѕСЃРјРѕС‚СЂ
    function loadInView(files) {
        // РџРѕРєР°Р·С‹РІР°РµРј РѕР±Р°СЃС‚СЊ РїСЂРµРґРїСЂРѕСЃРјРѕС‚СЂР°
        $('#uploaded-holder').show();

        // Р”Р»СЏ РєР°Р¶РґРѕРіРѕ С„Р°Р№Р»Р°
        $.each(files, function(index, file) {

            // РќРµСЃРєРѕР»СЊРєРѕ РѕРїРѕРІРµС‰РµРЅРёР№ РїСЂРё РїРѕРїС‹С‚РєРµ Р·Р°РіСЂСѓР·РёС‚СЊ РЅРµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ
            if (!files[index].type.match('image.*')) {

                if(errMessage == 0) {
                    $('#drop-files p').html('РўРѕР»СЊРєРѕ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ!');
                    ++errMessage
                }
                else if(errMessage == 1) {
                    $('#drop-files p').html('Р—Р°РіСЂСѓР¶Р°СЋС‚СЃСЏ С‚РѕР»СЊРєРѕ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ!');
                    ++errMessage
                }
                else if(errMessage == 2) {
                    $('#drop-files p').html("РўРѕР»СЊРєРѕ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ!");
                    ++errMessage
                }
                else if(errMessage == 3) {
                    $('#drop-files p').html("РўРѕР»СЊРєРѕ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ!");
                    errMessage = 0;
                }
                return false;
            }

            // РџСЂРѕРІРµСЂСЏРµРј РєРѕР»РёС‡РµСЃС‚РІРѕ Р·Р°РіСЂСѓР¶Р°РµРјС‹С… СЌР»РµРјРµРЅС‚РѕРІ
            if((dataArray.length+files.length) <= maxFiles) {
                // РїРѕРєР°Р·С‹РІР°РµРј РѕР±Р»Р°СЃС‚СЊ СЃ РєРЅРѕРїРєР°РјРё
                $('#upload-button').css({'display' : 'block'});
            }
            else { alert('Р’С‹ РЅРµ РјРѕР¶РµС‚Рµ Р·Р°РіСЂСѓР¶Р°С‚СЊ Р±РѕР»СЊС€Рµ '+maxFiles+' РёР·РѕР±СЂР°Р¶РµРЅРёР№!'); return; }

            // РЎРѕР·РґР°РµРј РЅРѕРІС‹Р№ СЌРєР·РµРјРїР»СЏСЂР° FileReader
            var fileReader = new FileReader();
            // РРЅРёС†РёРёСЂСѓРµРј С„СѓРЅРєС†РёСЋ FileReader
            fileReader.onload = (function(file) {

                return function(e) {
                    // РџРѕРјРµС‰Р°РµРј URI РёР·РѕР±СЂР°Р¶РµРЅРёСЏ РІ РјР°СЃСЃРёРІ
                    dataArray.push({name : file.name, value : this.result});
                    addImage((dataArray.length-1));
                };

            })(files[index]);
            // РџСЂРѕРёР·РІРѕРґРёРј С‡С‚РµРЅРёРµ РєР°СЂС‚РёРЅРєРё РїРѕ URI
            fileReader.readAsDataURL(file);
        });
        return false;
    }

    // РџСЂРѕС†РµРґСѓСЂР° РґРѕР±Р°РІР»РµРЅРёСЏ СЌСЃРєРёР·РѕРІ РЅР° СЃС‚СЂР°РЅРёС†Сѓ
    function addImage(ind) {
        // Р•СЃР»Рё РёРЅРґРµРєСЃ РѕС‚СЂРёС†Р°С‚РµР»СЊРЅС‹Р№ Р·РЅР°С‡РёС‚ РІС‹РІРѕРґРёРј РІРµСЃСЊ РјР°СЃСЃРёРІ РёР·РѕР±СЂР°Р¶РµРЅРёР№
        if (ind < 0 ) {
            start = 0; end = dataArray.length;
        } else {
            // РёРЅР°С‡Рµ С‚РѕР»СЊРєРѕ РѕРїСЂРµРґРµР»РµРЅРЅРѕРµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ
            start = ind; end = ind+1; }
        // РћРїРѕРІРµС‰РµРЅРёСЏ Рѕ Р·Р°РіСЂСѓР¶РµРЅРЅС‹С… С„Р°Р№Р»Р°С…
        if(dataArray.length == 0) {
            // Р•СЃР»Рё РїСѓСЃС‚РѕР№ РјР°СЃСЃРёРІ СЃРєСЂС‹РІР°РµРј РєРЅРѕРїРєРё Рё РІСЃСЋ РѕР±Р»Р°СЃС‚СЊ
            $('#upload-button').hide();
            $('#uploaded-holder').hide();
        } else if (dataArray.length == 1) {
            $('#upload-button span').html("Р‘С‹Р» РІС‹Р±СЂР°РЅ 1 С„Р°Р№Р»");
        } else {
            $('#upload-button span').html(dataArray.length+" С„Р°Р№Р»РѕРІ Р±С‹Р»Рё РІС‹Р±СЂР°РЅС‹");
        }
        // Р¦РёРєР» РґР»СЏ РєР°Р¶РґРѕРіРѕ СЌР»РµРјРµРЅС‚Р° РјР°СЃСЃРёРІР°
        //for (i = start; i < end; i++) {
        //    // СЂР°Р·РјРµС‰Р°РµРј Р·Р°РіСЂСѓР¶РµРЅРЅС‹Рµ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ
        //    if($('#dropped-files > .image').length <= maxFiles) {
        //        $('#dropped-files').append('<div id="img-'+i+'" class="image" style="background: url('+dataArray[i].value+'); background-size: cover;"> <a href="#" id="drop-'+i+'" class="drop-button">РЈРґР°Р»РёС‚СЊ РёР·РѕР±СЂР°Р¶РµРЅРёРµ</a></div>');
        //    }
        //}
        return false;
    }

    // Р¤СѓРЅРєС†РёСЏ СѓРґР°Р»РµРЅРёСЏ РІСЃРµС… РёР·РѕР±СЂР°Р¶РµРЅРёР№
    function restartFiles() {

        // РЈСЃС‚Р°РЅРѕРІРёРј Р±Р°СЂ Р·Р°РіСЂСѓР·РєРё РІ Р·РЅР°С‡РµРЅРёРµ РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ
        $('#loading-bar .loading-color').css({'width' : '0%'});
        $('#loading').css({'display' : 'none'});
        $('#loading-content').html(' ');

        // РЈРґР°Р»СЏРµРј РІСЃРµ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ РЅР° СЃС‚СЂР°РЅРёС†Рµ Рё СЃРєСЂС‹РІР°РµРј РєРЅРѕРїРєРё
        $('#upload-button').hide();
        $('#dropped-files > .image').remove();
        $('#uploaded-holder').hide();

        // РћС‡РёС‰Р°РµРј РјР°СЃСЃРёРІ
        dataArray.length = 0;

        return false;
    }

    // РЈРґР°Р»РµРЅРёРµ С‚РѕР»СЊРєРѕ РІС‹Р±СЂР°РЅРЅРѕРіРѕ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ
    $("#dropped-files").on("click","a[id^='drop']", function() {
        // РїРѕР»СѓС‡Р°РµРј РЅР°Р·РІР°РЅРёРµ id
        var elid = $(this).attr('id');
        // СЃРѕР·РґР°РµРј РјР°СЃСЃРёРІ РґР»СЏ СЂР°Р·РґРµР»РµРЅРЅС‹С… СЃС‚СЂРѕРє
        var temp = new Array();
        // РґРµР»РёРј СЃС‚СЂРѕРєСѓ id РЅР° 2 С‡Р°СЃС‚Рё
        temp = elid.split('-');
        // РїРѕР»СѓС‡Р°РµРј Р·РЅР°С‡РµРЅРёРµ РїРѕСЃР»Рµ С‚РёСЂРµ С‚РѕРµСЃС‚СЊ РёРЅРґРµРєСЃ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ РІ РјР°СЃСЃРёРІРµ
        dataArray.splice(temp[1],1);
        // РЈРґР°Р»СЏРµРј СЃС‚Р°СЂС‹Рµ СЌСЃРєРёР·С‹
        $('#dropped-files > .image').remove();
        // РћР±РЅРѕРІР»СЏРµРј СЌСЃРєРёР·Рё РІ СЃРѕРѕС‚РІРµС‚СЃРІРёРё СЃ РѕР±РЅРѕРІР»РµРЅРЅС‹Рј РјР°СЃСЃРёРІРѕРј
        addImage(-1);
    });

    // РЈРґР°Р»РёС‚СЊ РІСЃРµ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ РєРЅРѕРїРєР°
    $('#dropped-files #upload-button .delete').click(restartFiles);

    // Р—Р°РіСЂСѓР·РєР° РёР·РѕР±СЂР°Р¶РµРЅРёР№ РЅР° СЃРµСЂРІРµСЂ
    $('#upload-button .upload').click(function() {

        // РџРѕРєР°Р·С‹РІР°РµРј РїСЂРѕРіСЂРµСЃСЃ Р±Р°СЂ
        $("#loading").show();
        // РїРµСЂРµРјРµРЅРЅС‹Рµ РґР»СЏ СЂР°Р±РѕС‚С‹ РїСЂРѕРіСЂРµСЃСЃ Р±Р°СЂР°
        var totalPercent = 100 / dataArray.length;
        var x = 0;

        $('#loading-content').html('Р—Р°РіСЂСѓР¶РµРЅ '+dataArray[0].name);
        // Р”Р»СЏ РєР°Р¶РґРѕРіРѕ С„Р°Р№Р»Р°
        $.each(dataArray, function(index, file) {
            // Р·Р°РіСЂСѓР¶Р°РµРј СЃС‚СЂР°РЅРёС†Сѓ Рё РїРµСЂРµРґР°РµРј Р·РЅР°С‡РµРЅРёСЏ, РёСЃРїРѕР»СЊР·СѓСЏ HTTP POST Р·Р°РїСЂРѕСЃ
            $.post('/c/uploadImg', dataArray[index], function(data) {

                var fileName = dataArray[index].name;
                //console.log(dataArray[index]);
                ++x;

                // РР·РјРµРЅРµРЅРёРµ Р±Р°СЂР° Р·Р°РіСЂСѓР·РєРё
                $('#loading-bar .loading-color').css({'width' : totalPercent*(x)+'%'});
                // Р•СЃР»Рё Р·Р°РіСЂСѓР·РєР° Р·Р°РєРѕРЅС‡РёР»Р°СЃСЊ
                if(totalPercent*(x) == 100) {
                    // Р—Р°РіСЂСѓР·РєР° Р·Р°РІРµСЂС€РµРЅР°
                    $('#loading-content').html('Р—Р°РіСЂСѓР·РєР° Р·Р°РІРµСЂС€РµРЅР°!');

                    // Р’С‹Р·С‹РІР°РµРј С„СѓРЅРєС†РёСЋ СѓРґР°Р»РµРЅРёСЏ РІСЃРµС… РёР·РѕР±СЂР°Р¶РµРЅРёР№ РїРѕСЃР»Рµ Р·Р°РґРµСЂР¶РєРё 1 СЃРµРєСѓРЅРґР°
                    setTimeout(restartFiles, 1000);
                    // РµСЃР»Рё РµС‰Рµ РїСЂРѕРґРѕР»Р¶Р°РµС‚СЃСЏ Р·Р°РіСЂСѓР·РєР°
                } else if(totalPercent*(x) < 100) {
                    // РљР°РєРѕР№ С„Р°Р№Р» Р·Р°РіСЂСѓР¶Р°РµС‚СЃСЏ
                    $('#loading-content').html('Р—Р°РіСЂСѓР¶Р°РµС‚СЃСЏ '+fileName);
                }
                var s = $.parseJSON(data);
                $('#sortable-slider').append('<li class="ui-state-default" id="slide-'+ s.id+'">' +
                '' +'<input type="checkbox"  id="'+s.id+'" checked="checked" class="rtg"><label class="gtr" for="'+s.id+'"></label>'+
                '<img src="'+ s.img+'" style="height:50px; width:100px;" ><label class="img-link"> РЎcС‹Р»РєР° <input id="'+ s.id+'" value="https://" type="text"></label><a class="slideDel" href="#" slide_id="'+ s.id+'">' +
                '<img src="/i/icons/delete_icon_basket.gif"></a></li>');

            });
        });
        // РџРѕРєР°Р·С‹РІР°РµРј СЃРїРёСЃРѕРє Р·Р°РіСЂСѓР¶РµРЅРЅС‹С… С„Р°Р№Р»РѕРІ
        //$('#uploaded-files').show();
        return false;
    });

    // РџСЂРѕСЃС‚С‹Рµ СЃС‚РёР»Рё РґР»СЏ РѕР±Р»Р°СЃС‚Рё РїРµСЂРµС‚Р°СЃРєРёРІР°РЅРёСЏ
    $('#drop-files').on('dragenter', function() {
        $(this).css({'box-shadow' : 'inset 0px 0px 20px rgba(0, 0, 0, 0.1)', 'border' : '4px dashed #bb2b2b'});
        return false;
    });

    $('#drop-files').on('drop', function() {
        $(this).css({'box-shadow' : 'none', 'border' : '4px dashed rgba(0,0,0,0.2)'});
        return false;
    });
});
