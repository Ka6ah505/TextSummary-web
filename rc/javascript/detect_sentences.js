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
 * Нахождение тегов с правой стороный от потенциальной точки конца предложения
 * @param {string} text текст для поски слов
 * @param {number} position позиция с которой отбираются слова
 * @param {number} get количество возвращаемых слов
 * @return {array} итоговый массив слов
*/
var search_right_word = function(text, position, get) {
	var m = text.split("");
	var len = text.split("").length;
	var tempmass = cutRange(m, position+1, len).join("");

	var tokens = tempmass.split(/(\,)|(\))|(\()|(\;)|(\:)|(\+)|(\№)|(\*)|(\&)|(\@)|(\s)|(\.)/g);
	tokens = tokens.filter(function(item) {
		return item != undefined && item != "";
	});
	tokens = cutRange(tokens,0,get-1);
	return fill_miss_elements(tokens, get, true);
};

/**
 * Находение тегов с левой стороны от потенциальной точки конца предложения
 * @param {string} text текст для поски слов
 * @param {number} position позиция с которой отбираются слова
 * @param {number} get количество возвращаемых слов
 * @return {array} итоговый массив слов
*/
var search_left_word = function(text, position, get) {
	var m = text.split("");
	var tempmass = cutRange(m, 0, position-1).join("");

	var tokens = tempmass.split(/(\,)|(\))|(\()|(\;)|(\:)|(\+)|(\№)|(\*)|(\&)|(\@)|(\s)|(\.)/g);
	tokens = tokens.filter(function(item) {
		return item != undefined && item != "";
	});
	tokens = cutRange(tokens, tokens.length-get,tokens.length);
	return fill_miss_elements(tokens, get, false);
};

/**
 * Заполнение массива пустыми элементами до определённого размера undefined`ми
 * @param {array} mass массив для заполнения
 * @param {number} maxElements размер до которого расширяем массив
 * @param {bool} isPosit направление заполнения true - добавляем в конец, false - добавляем в начало
 * @return {array} заполненныей массив
*/
var fill_miss_elements = function(mass, maxElements, isPosit=true) {
	var len = mass.length;
	for (var i=0; i<maxElements-len;i++) {
		if (isPosit) {
			mass.push(undefined);
		} else {
			mass.unshift(undefined);
		}
	}
	return mass;
};

var pos = find_separete(testtext1)[1];
console.log("left\t", search_left_word(testtext1, pos, 3));
console.log("right\t", search_right_word(testtext1, pos, 3));

//console.log(fill_miss_elements([1,2], 3, true));
