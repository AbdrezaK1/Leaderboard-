(function(){

	function yapl(){
		var _resolve, _reject;
		var _ = new Promise(function(resolve, reject){
			_resolve = function(val){
				resolve(val);
				return _;
			};
			_reject = function(val){
				reject(val);
				return _;
			};
		});
		_.resolve = _resolve;
		_.reject = _reject;
		return _;
	}

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
		module.exports = yapl;
	else
		window.yapl = yapl;
	
})();