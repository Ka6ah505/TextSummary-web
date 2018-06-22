var signs = ".!?";
var testtext = "В настоящее время Розничный. бизнес и обеспечивающие процессы находятся под сильным негативным влиянием проблемы работоспособности устройств самообслуживания с функцией рециркуляции.";

// поиск координаты расположения потенциального разднлителя
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

// нахождение тегов с левой стороный от потенциальной точки конца предложения
var search_left_word = function(text, position, get) {

};

console.log(find_separete(testtext));
