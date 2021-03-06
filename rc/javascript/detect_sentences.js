var detect_sentences = {

	signs: ".!?",
	// testtext: "В настоящее время Розничный. бизнес и обеспечивающие процессы находятся под сильным негативным влиянием проблемы работоспособности устройств самообслуживания с функцией рециркуляции.",
	// testtext1: "Рубим.. Пилим дерево(баобаб) руками, ногами",
	// testtext2: "Прошел на улице дождь.",
	// testtext3: "Функция 1. Организация и проведение проверок (в т.ч. в ходе ревизий) в ТБ",

	/**
	 * Поиск координаты расположения потенциального разднлителя
	 * @param {string} text текст в котором ищем предполагаемые разделители
	 * @return {array} список координат
	*/
	find_separate:function(text) {
		var positions = [];
		var tokens = text.split("");
		for (var i = 0; i < tokens.length; i++) {
			if (tokens[i].search(/[\.\?\!]/g)>-1) {
				positions.push(i);
			}
		}
		return positions;
	},

	/**
	 * Oбрезание массива до определенного диапазона
	 *
	 * @param {array} arr массив для вырехания подпоследлвательности из него
	 * @param {number} start позиция начала подпоследовательнсти
	 * @param {number} end позиция конца подпоследовательности
	 * @return {array} получившаяся подполследовательность
	*/
	cutRange:function (arr, start, end) {
	  var result = [];
	  for (var i = 0; i < arr.length; i++) {
	    if (i >= start && i <= end) {
	      result.push(arr[i]);
	    }
	  }
	  return result;
	},

	/**
	 * Нахождение тегов с правой стороный от потенциальной точки конца предложения
	 * @param {string} text текст для поски слов
	 * @param {number} position позиция с которой отбираются слова
	 * @param {number} get количество возвращаемых слов
	 * @return {array} итоговый массив слов
	*/
	search_right_word:function(text, position, get) {
		var m = text.split("");
		var len = text.split("").length;
		var tempmass = this.cutRange(m, position+1, len).join("");

		var tokens = tempmass.split(/(\,)|(\))|(\()|(\;)|(\:)|(\+)|(\№)|(\*)|(\&)|(\@)|(\s)|(\")|(\.)/g);
		tokens = tokens.filter(function(item) {
			return item != undefined && item != "";
		});
		tokens = this.cutRange(tokens,0,get-1);
		return this.fill_miss_elements(tokens, get, true);
	},

	/**
	 * Находение тегов с левой стороны от потенциальной точки конца предложения
	 * @param {string} text текст для поски слов
	 * @param {number} position позиция с которой отбираются слова
	 * @param {number} get количество возвращаемых слов
	 * @return {array} итоговый массив слов
	*/
	search_left_word:function(text, position, get) {
		var m = text.split("");
		var tempmass = this.cutRange(m, 0, position-1).join("");

		var tokens = tempmass.split(/(\,)|(\))|(\()|(\;)|(\:)|(\+)|(\№)|(\*)|(\&)|(\@)|(\s)|(\")|(\.)/g);
		tokens = tokens.filter(function(item) {
			return item != undefined && item != "";
		});
		tokens = this.cutRange(tokens, tokens.length-get,tokens.length);
		return this.fill_miss_elements(tokens, get, false);
	},

	/**
	 * Заполнение массива пустыми элементами до определённого размера null`ми
	 * @param {array} mass массив для заполнения
	 * @param {number} maxElements размер до которого расширяем массив
	 * @param {bool} isPosit направление заполнения true - добавляем в конец, false - добавляем в начало
	 * @return {array} заполненныей массив
	*/
	fill_miss_elements:function(mass, maxElements, isPosit=true) {
		var len = mass.length;
		for (var i=0; i<maxElements-len;i++) {
			if (isPosit) {
				mass.push(null);
			} else {
				mass.unshift(null);
			}
		}
		return mass;
	},

	/**
	 * Определение яв ляется ли токен знаком препинания
	 *
	 * @param {string} token токен на проверку
	 * @return {number} 1-если токен знак припинания, 0-если таким не явояется
	*/
	detect_punctuation_mark:function(token) {
		try {
			if (token.indexOf(/(\,)|(\))|(\()|(\;)|(\:)|(\+)|(\№)|(\*)|(\&)|(\@)|(\")|(\.)/g) && token.length==0) {
				return 1;
			}
		} catch (err) {
			return 0;
		}
		return 0;
	},

	/**
	 * Определение всё-ли слово состоит из прописных букв
	 * @param {string} token слово для проверки
	 * @return {number} 1 - если состоит только из прописных, 0-если есть и другие символы
	*/
	detect_upper_sign:function(token) {
		try {
			var m = token.split();
			for (var i=0; i<m.length; i++) {
				if (/[a-zа-я0-9]/g.test(m[i])) {
					return 0;	
				}
			}
		} catch(err) {
			return 0;
		}
		return 1;
	},

	/**
	 * Определение начинается ли слово с заглавной буквы
	 * @param {string} слово для проверки
	 * @return {number} 1-слово начинается с заглавной, 0- начинается не с заглавной
	*/
	detect_first_upper_sign:function(token) {
		try {
			if (token.match(/^[A-ZА-Я]{1}[a-zа-я]*$/g)) {
				return 1;
			}
		} catch(err) {
			return 0;	
		}
		return 0;
	},

	/**
	 * Определение длины строки
	 * @param {string} token слово для замера
	 * @return {number} 1-длина больше одного символа, 0-меньше равна одному символу
	*/
	detect_len_sequence:function(token) {
		try {
			if (token.split("").length>1) { return 1; }
		} catch(err) {
			return 0;
		}
		
		return 0;
	},

	/**
	 * Проверка на число
	 * @param {string} token строка для проверки
	 * @return {number} 1-если строка число, 0-неявляется числом
	*/
	detect_digit_sign:function(token) {
		//if (typeof(token) == number) {
		if (!isNaN(parseFloat(token)) && isFinite(token)) {
			return 1;
		}
		return 0;
	},

	/**
	 * составление вектора фич
	 * @param {string} sentence предложение для разбора
	 * @param {number} len количество слов в окрестности предполагаемого оканчания
	 * @return {array} матрица из фич 
	*/
	calculate_vector:function(sentence, len) {
		var matrix = [];
		var punctuation = this.find_separate(sentence);
		for (var i=0; i < punctuation.length; i++) {
			var l = this.search_left_word(sentence, punctuation[i], len);
			var r = this.search_right_word(sentence, punctuation[i], len);
			matrix.push([].concat(this.calculate_one_side(l),this.calculate_one_side(r), punctuation[i]));
		};

		var m = [];
		for (var i=0; i<matrix.length; i++) {
			var item = {};
			for (var j=0;j<matrix[i].length-1; j++) {
				item['a'+j] = matrix[i][j];
			}
			item['number'] = matrix[i][matrix[i].length-1]
			m.push(item);
		};

		//return matrix;
		return m;
	},

	/**
	 * Вычисление фич по массиву слов
	 * @param {array} words массив слов
	 * @return {array} массив фич
	*/
	calculate_one_side:function(words) {
		var feature = [];
		for (var i=0; i<words.length; i++) {
			feature.push(this.detect_punctuation_mark(words[i]));
			feature.push(this.detect_upper_sign(words[i]));
			feature.push(this.detect_first_upper_sign(words[i]));
			feature.push(this.detect_len_sequence(words[i]));
			feature.push(this.detect_digit_sign(words[i]));
		}
		return feature;
	},

	//console.log(calculate_vector(testtext3, 1));
};