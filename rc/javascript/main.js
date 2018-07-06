// настройка ограничений для поля ввода
$(document).ready(function () {
	// блок констант
    var MAX_INPUTTEXT_LENGTH = 10000,
        LOCALSTORAGE_TEXT_KEY = 'tonality-marking-text',
        LOCALSTORAGE_PROCESSTYPE_KEY = 'process-type',
        DEFAULT_TEXT = '',
        ShowInformationsAboutLimits = false,
        tickmarks = 20,
        // инициализация словарей с нормализацией
		morhynizator = Az.Morph.init('rc/Az.js-master/dicts');

    // замерка длины введенного текста
    var textOnChange = function () {
        var _len = $("#inputText").val().length; 
        var len = _len.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        var $textLength = $("#textLength");
        $textLength.html("длина текста: " + len + " символов");
        if (MAX_INPUTTEXT_LENGTH < _len) $textLength.addClass("max-inputtext-length");
        else                             $textLength.removeClass("max-inputtext-length");
    };
	
	// получение текта из поля ввода
    var getText = function( $text ) {
        var text = trim_text( $text.val().toString() );
        if (is_text_empty(text)) {
            alert("Введите текст для обработки.");
            $text.focus();
            return (null);
        }
        
        if (text.length > MAX_INPUTTEXT_LENGTH) {
            if (!confirm('Превышен рекомендуемый лимит ' + MAX_INPUTTEXT_LENGTH + ' символов (на ' + (text.length - MAX_INPUTTEXT_LENGTH) + ' символов).\r\nТекст будет обрезан, продолжить?')) {
                return (null);
            }
            text = text.substr( 0, MAX_INPUTTEXT_LENGTH );
            $text.val( text );
            $text.change();
        }
        return (text);
    };

    // слушатель изменнений в окне
    $("#inputText").focus(textOnChange).change(textOnChange).keydown(textOnChange).keyup(textOnChange).select(textOnChange).focus();

    (function () {
        var text = ''
        if (!text || !text.length) {
            text = DEFAULT_TEXT;
        }
        $('#inputText').val(text).focus();
    })();

    // очиска поля ввода
    $('#resetText2Default').click(function () {
        setTimeout(function () {
            $("#inputText").val(DEFAULT_TEXT).focus();
            $("#outputText").val(DEFAULT_TEXT);
        }, 100);
    });

    // слушатель ползунка
    $('#summary').change(function() {
        tickmarks = $('#summary').val();
        console.log(tickmarks);
    });

    
	
	//-------------------------------------------------------------------	
	
	// обработка кнопки "выполнить"
    $('#mainPageContent').on('click', '#processButton', function () {
        var Items = [];
        var massSentences = calculateSentence(getText( $("#inputText") ));
        for (var i=0; i < massSentences.length; i++) {

            // вычисляем важность предложения
            var tempScore = calculatingScore(tokeniserText(massSentences[i]));

            // список объектов(свойств предложений)
            Items.push({
                    number: i, 
                    text: massSentences[i],
                    weight: tempScore,
                }
            );
        }


        
        console.log("Всего элементов\t",massSentences.length);

        // вывод по убыванию
        
        console.log(Items.sort(compareWeight));
        // $("#outputText").val(temptext);
    });

    /**
     * Сравнение весов предложений
     *
     * @param {object} obj1 первый объект
     * @param {object} obj2 второй объект
     * @return место?
    */
    function compareWeight(obj1, obj2) {
        return obj2.weight - obj1.weight;
    }

    /**
     * Морфирование слов в предложении и преведение к инфинитиву
     *
     * @param {string} text - Предлодение на обработку
     * @return {array} массив инфинитивов слов из которых состоит полученный текст.
    */
    function tokeniserText(text) {
        tokenizator = Az.Tokens(text, { // токенизацяи текста
                html: true,
                wiki: true,
                markdown: true
            }
        );

        var tokens = tokenizator.done({ 'WORD': true }, true) //токены слова
        var massWords = []; // массив для слов
        for (var i = 0; i < tokens.length; i++) {
            var t = Az.Morph(tokens[i].toString(), { typos: 'auto' }); // морфологический разбор слова
            massWords.push(t[0].normalize(true).word); //начальная форма слова 
            //temptext = temptext + tword+ '\n'; // вывод
        }

        return massWords;
    };

    /**
     * Сумма слов массива
     *
     * @param {array} massWords массив инфинитивов
     * @return {number} сумма всех слов по словарю idf
     *
    */
    function calculatingScore(massWords) {
        var score = 0;
        for(var i = 0; i < massWords.length; i++) {
            var tempItem = getDictionary(massWords[i]);
            if (tempItem != undefined) {
                score = score + tempItem;
            } else {
                console.log("надо смотреть")
            }
        }
        return score / massWords.length;
    };

    /**
     * Oбрезание массива до определенного диапазона
     *
     * @param {string} text текст пользователя в котором выделяем предложения
     * @return {array} массив обнаруженных предложений
    */
    function calculateSentence(text) {
        var data = [
            {a0:0,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:0,a8:1,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:0,number:180,  answer:1},
            {a0:0,a1:0,a2:1,a3:1,a4:0,a5:0,a6:0,a7:0,a8:1,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:1,a16:0,a17:0,a18:0,a19:0,a20:1,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:1,a28:1,a29:0,number:26,   answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:0,a6:0,a7:0,a8:1,a9:0,a10:1,a11:0,a12:0,a13:0,a14:0,a15:1,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:1,a23:1,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:27,   answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:1,a11:0,a12:0,a13:0,a14:0,a15:0,a16:0,a17:1,a18:1,a19:0,a20:0,a21:0,a22:0,a23:1,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:28,   answer:1},
            {a0:1,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:1,a8:1,a9:0,a10:0,a11:0,a12:0,a13:0,a14:1,a15:0,a16:0,a17:0,a18:1,a19:1,a20:1,a21:0,a22:0,a23:0,a24:0,a25:1,a26:0,a27:0,a28:0,a29:0,number:110,  answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:0,number:211,  answer:1},
            {a0:0,a1:0,a2:1,a3:1,a4:0,a5:0,a6:0,a7:0,a8:1,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:1,a18:1,a19:0,a20:0,a21:0,a22:0,a23:1,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:25,   answer:1},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:0,a6:0,a7:0,a8:1,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:0,number:58,   answer:1},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:0,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:0,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:1,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:1,a28:1,a29:0,number:16,   answer:0},
            {a0:0,a1:0,a2:0,a3:0,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:0,a14:0,a15:0,a16:0,a17:1,a18:1,a19:0,a20:0,a21:0,a22:0,a23:1,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:18,   answer:1},
            {a0:0,a1:0,a2:1,a3:1,a4:0,a5:0,a6:0,a7:0,a8:1,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:0,number:36,   answer:1},
            {a0:0,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:0,a8:0,a9:0,a10:0,a11:1,a12:1,a13:0,a14:0,a15:0,a16:0,a17:0,a18:0,a19:1,a20:1,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:1,number:1,    answer:0},
            {a0:0,a1:1,a2:1,a3:0,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:0,a14:1,a15:0,a16:0,a17:0,a18:0,a19:1,a20:1,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:1,number:3,    answer:0},
            {a0:0,a1:0,a2:0,a3:0,a4:1,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:0,a14:1,a15:0,a16:0,a17:0,a18:0,a19:1,a20:1,a21:0,a22:0,a23:0,a24:0,a25:0,a26:1,a27:0,a28:1,a29:0,number:5,    answer:0},
            {a0:0,a1:0,a2:0,a3:0,a4:1,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:0,a14:1,a15:0,a16:1,a17:0,a18:1,a19:0,a20:0,a21:0,a22:1,a23:1,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:7,    answer:0},
            {a0:0,a1:1,a2:0,a3:1,a4:0,a5:0,a6:0,a7:1,a8:1,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:0,number:26,   answer:1},
            {a0:0,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:1,a8:1,a9:0,a10:0,a11:0,a12:0,a13:0,a14:1,a15:0,a16:0,a17:1,a18:1,a19:0,a20:0,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:9,    answer:1},
            {a0:1,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:0,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:1,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:0,number:49,   answer:0},
            {a0:0,a1:0,a2:0,a3:0,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:0,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:1,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:51,   answer:0},
            {a0:0,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:0,a8:1,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:0,number:255,  answer:1},
            {a0:1,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:0,a8:0,a9:1,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:1,a19:0,a20:1,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:100,  answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:1,a19:0,a20:0,a21:0,a22:0,a23:0,a24:1,a25:0,a26:0,a27:0,a28:1,a29:0,number:105,  answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:0,a6:0,a7:0,a8:0,a9:1,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:1,a19:0,a20:1,a21:0,a22:0,a23:0,a24:0,a25:1,a26:0,a27:0,a28:0,a29:0,number:116,  answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:1,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:1,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:121,  answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:0,a6:0,a7:0,a8:1,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:0,number:246,  answer:1},
            {a0:1,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:0,a14:0,a15:0,a16:0,a17:1,a18:1,a19:0,a20:0,a21:0,a22:0,a23:1,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:27,   answer:0},
            {a0:0,a1:0,a2:1,a3:1,a4:0,a5:0,a6:0,a7:0,a8:1,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:1,a18:1,a19:0,a20:0,a21:0,a22:0,a23:0,a24:0,a25:1,a26:0,a27:0,a28:0,a29:0,number:40,   answer:0},
            {a0:1,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:1,a8:1,a9:0,a10:0,a11:0,a12:0,a13:0,a14:0,a15:0,a16:0,a17:0,a18:0,a19:1,a20:1,a21:0,a22:0,a23:0,a24:0,a25:1,a26:0,a27:0,a28:0,a29:0,number:52,   answer:0},
            {a0:0,a1:0,a2:0,a3:0,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:0,a14:1,a15:1,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:1,a24:0,a25:1,a26:0,a27:0,a28:0,a29:0,number:54,   answer:0},
            {a0:1,a1:0,a2:0,a3:0,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:0,a19:1,a20:0,a21:0,a22:0,a23:1,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:61,   answer:0},
            {a0:1,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:0,a8:0,a9:1,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:1,a19:0,a20:1,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:0,number:93,   answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:1,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:98,   answer:0},
            {a0:0,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:0,a8:1,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:1,a19:0,a20:0,a21:0,a22:0,a23:1,a24:0,a25:0,a26:0,a27:0,a28:0,a29:0,number:115,  answer:0},
            {a0:0,a1:0,a2:1,a3:1,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:1,a19:0,a20:1,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:153,  answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:1,a19:0,a20:1,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:1,a29:1,number:162,  answer:0},
            {a0:1,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:0,a8:0,a9:1,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:1,a19:0,a20:1,a21:0,a22:0,a23:0,a24:0,a25:1,a26:0,a27:0,a28:0,a29:0,number:206,  answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:1,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:1,a24:0,a25:1,a26:0,a27:0,a28:0,a29:0,number:211,  answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:1,a11:0,a12:0,a13:0,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:0,number:253,  answer:1},
            {a0:1,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:0,a8:0,a9:1,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:1,a19:0,a20:1,a21:0,a22:0,a23:0,a24:0,a25:1,a26:0,a27:0,a28:0,a29:0,number:72,   answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:1,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:1,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:77,   answer:0},
            {a0:1,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,a7:0,a8:0,a9:1,a10:0,a11:0,a12:0,a13:1,a14:0,a15:0,a16:0,a17:0,a18:1,a19:0,a20:1,a21:0,a22:0,a23:0,a24:0,a25:1,a26:0,a27:0,a28:0,a29:0,number:203,  answer:0},
            {a0:0,a1:0,a2:0,a3:1,a4:0,a5:1,a6:0,a7:0,a8:0,a9:0,a10:0,a11:0,a12:0,a13:1,a14:0,a15:1,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:1,a24:0,a25:0,a26:0,a27:0,a28:1,a29:0,number:208,  answer:0},
            {a0:0,a1:0,a2:1,a3:1,a4:0,a5:0,a6:1,a7:0,a8:1,a9:0,a10:1,a11:0,a12:0,a13:0,a14:0,a15:0,a16:0,a17:0,a18:0,a19:0,a20:0,a21:0,a22:0,a23:0,a24:0,a25:0,a26:0,a27:0,a28:0,a29:0,number:298,  answer:1}
        ];

        var config = {
            trainingSet: data,
            categoryAttr: 'answer',
            ignoredAttributes: ['number']
            // maxTreeDepth: 10,
            // entropyThrehold: 0.05,
            // minItemsCount: 3
        };

        var numberOfTrees = 5;
        var randomForest = new dt.RandomForest(config, numberOfTrees);
        
        function testRun(text) {
            var arrPuncts = detect_sentences.calculate_vector(text, 3);

            var arrMass = {};
            for (var i=0; i<arrPuncts.length; i++) {
                // console.log(detectAnswer(randomForest.predict(arrPuncts[i])));
                arrMass[arrPuncts[i].number]=detectAnswer(randomForest.predict(arrPuncts[i]));
            }

            var arrtext = text.split("");

            var tempCount=0;
            for (var key in arrMass) {
                if (arrMass[key] === 1) {
                    // console.log(+key+1+tempCount);
                    arrtext.splice(+key+1+tempCount, 0, '<EOF>')
                    tempCount++;
                }
            }
            return arrtext.join("").split('<EOF>')
        }

        function detectAnswer(item) {
            var answer = 0;
            var diff = -1;

            for (var key in item) {
                if (item[key]>diff) {
                    diff = item[key];
                    answer = +key;
                }
            }
            return answer;
        }

        return testRun(text);
    };
	
	
	
	//----------------------------------------------------------------------------------
	
    function processing_start(){
        $('#inputText').addClass('no-change').attr('readonly', 'readonly').attr('disabled', 'disabled');
        $('.result-info').show().removeClass('error').html('Идет обработка... <label id="processingTickLabel"></label>');
        $('#processButton').addClass('disabled');
        $('#processResult').empty();
        setTimeout(processing_tick, 1000);
    };
    function processing_end(){
        $('#inputText').removeClass('no-change').removeAttr('readonly').removeAttr('disabled');
        $('.result-info').removeClass('error').text('');
        $('#processButton').removeClass('disabled');
    };
	// 
    function trim_text(text) {
        return (text.replace(/(^\s+)|(\s+$)/g, ""));
    };
	// очиска текста
    function is_text_empty(text) {
        return (text.replace(/(^\s+)|(\s+$)/g, "") == "");
    };
	//Запрос к бэку
    // (function() {
    //     $.ajax({
    //         type: "POST",
    //         url: "RESTProcessHandler.ashx",
    //         timeout: (600 * 1000),
    //         data: { text: "_dummy_", forceLoadModel: true }
    //     });
    // })();
	
    // var processingTickCount = 1;
    // function processing_tick() {
    //     var n2 = function (n) {
    //         n = n.toString();
    //         return ((n.length == 1) ? ('0' + n) : n);
    //     }
    //     var d = new Date(new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(processingTickCount));
    //     var t = n2(d.getHours()) + ':' + n2(d.getMinutes()) + ':' + n2(d.getSeconds()); //d.toLocaleTimeString();
    //     var $s = $('#processingTickLabel');
    //     if ($s.length) {
    //         $s.text(t);
    //         processingTickCount++;
    //         setTimeout(processing_tick, 1000);            
    //     } else {
    //         processingTickCount = 1;
    //     }        
    // }
});