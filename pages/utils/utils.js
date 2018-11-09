/**************************************无重复列表************************************/
module.exports = function concatDistinct(array1, array2) {
	var array = array1.concat();
	for (var item of array2) {
		if (array.indexOf(item) < 0) {
			array.push(item);
		}
	}
	return array;
}