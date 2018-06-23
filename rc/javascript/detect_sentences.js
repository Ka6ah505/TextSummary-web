var signs = ".!?";
var testtext = "В настоящее время Розничный. бизнес и обеспечивающие процессы находятся под сильным негативным влиянием проблемы работоспособности устройств самообслуживания с функцией рециркуляции.";
var testtext1 = "Рубим.. Пилим дерево(баобаб) руками, ногами";
var testtext2 = "Прошел на улице дождь.";

/**
 * Поиск координаты расположения потенциального разднлителя
 * @param {string} text текст в котором ищем предполагаемые разделители
 * @return {array} список координат
*/
var find_separete = function(text) {
	var positions = [];
	var tokens = text.split("");
	for (var i = 0; i < tokens.length; i++) {
		if (tokens[i].search(/[\.\?\!]/g)>-1) {
			positions.push(i);
		}
	}
	return positions;
};

/**
 * Oбрезание массива до определенного диапазона
 *
 * @param {array} arr массив для вырехания подпоследлвательности из него
 * @param {number} start позиция начала подпоследовательнсти
 * @param {number} end позиция конца подпоследовательности
 * @return {array} получившаяся подполследовательность
*/
function cutRange(arr, start, end) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    if (i >= start && i <= end) {
      result.push(arr[i]);
    }
  }
  return result;
};

/**
 * Нахождение тегов с левой стороный от потенциальной точки конца предложения
 * @param {string} text текст для поски слов
 * @param {number} position позиция с которой отбираются слова
 * @param {number} get количество возвращаемых слов
 * @return {array} итоговый массив слов
*/
var search_left_word = function(text, position, get) {
	var m = text.split("");
	var len = text.split("").length;
	var tempmass = cutRange(m, position+1, len).join("");

	var tokens = tempmass.split(/(\,)|(\))|(\()|(\;)|(\:)|(\+)|(\№)|(\*)|(\&)|(\@)|(\s)/g);
	tokens = tokens.filter(function(item) {
		return item != undefined && item != "";
	});
	return cutRange(tokens,0,get-1);
};

/**
 * Находение тего с правой стороны от потенциальной точки конца предложения
 * @param {string} text текст для поски слов
 * @param {number} position позиция с которой отбираются слова
 * @param {number} get количество возвращаемых слов
 * @return {array} итоговый массив слов
*/
var search_right_word = function(text, position, get) {
	var m = text.split("");
	var tempmass = cutRange(m, 0, position-1).join("");

	var tokens = tempmass.split(/(\,)|(\))|(\()|(\;)|(\:)|(\+)|(\№)|(\*)|(\&)|(\@)|(\s)/g);
	tokens = tokens.filter(function(item) {
		return item != undefined && item != "";
	});
	return cutRange(tokens, tokens.length-get,tokens.length);
};

var pos = find_separete(testtext2)[0];
//console.log(search_left_word(testtext1, pos, 3));
console.log(search_right_word(testtext2, pos, 3));
