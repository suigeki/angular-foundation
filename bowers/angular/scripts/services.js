/*myApp.service('testService', function() {
	this.getData = function() {
		return 'Test de service réussi !';
	}
});*/

myApp.service('alimentsService', function($http) {
	//delete $http.defaults.headers.common['X-Requested-With'];
	this.getData = function() {
		return $http({
	        method: 'GET',
	        url: 'http://localhost:8080/wsfoodpaleo/ws/food/all',
	        dataType: 'text'
	    });
	}
});

myApp.service('readAlimService', function($http) {
	//delete $http.defaults.headers.common['X-Requested-With'];
	this.readData = function(id) {
		return $http({
	        method: 'GET',
	        url: 'http://localhost:8080/wsfoodpaleo/ws/food/read/'+id,
	        dataType: 'text'
	    });
	}
});
		
myApp.service('postAlimService', function($http) {
	//delete $http.defaults.headers.common['X-Requested-With'];
	this.deleteData = function(id) {
		return $http({
	        method: 'POST',
	        url: 'http://localhost:8080/wsfoodpaleo/ws/food/post',
	        dataType: 'text'
	    });
	}
});
		
myApp.service('putAlimService', function($http) {
	//delete $http.defaults.headers.common['X-Requested-With'];
	this.deleteData = function(id) {
		return $http({
	        method: 'PUT',
	        url: 'http://localhost:8080/wsfoodpaleo/ws/food/put/'+id,
	        dataType: 'text'
	    });
	}
});
		
myApp.service('delAlimService', function($http) {
	//delete $http.defaults.headers.common['X-Requested-With'];
	this.deleteData = function(id) {
		return $http({
	        method: 'DELETE',
	        url: 'http://localhost:8080/wsfoodpaleo/ws/food/delete/'+id,
	        dataType: 'text'
	    });
	}
});
		
myApp.service('categoriesService', function($http) {
	//delete $http.defaults.headers.common['X-Requested-With'];
	this.getData = function() {
		return $http({
	        method: 'GET',
	        url: 'http://localhost:8080/wsfoodpaleo/ws/category/all',
	        dataType: 'text'
	    });
	}
});
		
myApp.service('saisonsService', function($http) {
	//delete $http.defaults.headers.common['X-Requested-With'];
	this.getData = function() {
		return $http({
	        method: 'GET',
	        url: 'http://localhost:8080/wsfoodpaleo/ws/season/all',
	        dataType: 'text'
	    });
	}
});
		
myApp.service('calculsService', function() {
	//Basal Metabolic Rate Mifflin St. Jeor Equation
	this.getBMR = function(w, h, a, s, lean) {
		//myBMR = parseInt(w);
		if(s == "Homme"){
			//myBMR = Math.round(10 * parseInt(w) + 6.25 * parseInt(h) - 5 * parseInt(a) + 5);
			//myBMR = Math.round(12.7 * (parseInt(h) / 2.54) + 66 + 6.3 * (parseInt(lean) * 2.2) - 6.8 * parseInt(a));
			myBMR = Math.round((13.8 * (parseInt(lean) * 2.2)) / 2.2 + 5 * 2.54 * (parseInt(h) / 2.54) - 6.8 * parseInt(a) + 66.5);
		}else{
			//myBMR = Math.round(10 * parseInt(w) + 6.25 * parseInt(h) - 5 * parseInt(a) - 161);
			//myBMR = Math.round(4.7 * (parseInt(h) / 2.54) + 655 + 4.3 * (parseInt(lean) * 2.2) - 4.7 * parseInt(a));
			myBMR = Math.round((9.6 * (parseInt(lean) * 2.2)) / 2.2 + 1.8 * 2.54 * (parseInt(h) / 2.54) - 4.7 * parseInt(a) + 655.1);
		}
		return myBMR
		//return 52;
	}
	//Daily Calories Intake Harris Benedict Formula
	this.getDCI = function(activity) {
		myDCI = Math.round(myBMR * parseFloat(activity));
		return myDCI;
	}
	//Body Mass Index
	this.getBF = function(w, h, a, s) {
		var BMI = parseInt(w) / (parseInt(h)*parseInt(h));
		var sexe = (s == "Homme") ? 1 : 0;
		if(parseInt(a) < 16){	//Pour les enfants on passe par indice de masse corporelle ou BMI						
			return Math.round((1.51 * BMI) - (0.70 * parseInt(a)) - (3.6 * sexe) + 1.4);
		}else{
			return Math.round((1.20 * BMI) + (0.23 * parseInt(a)) - (10.8 * sexe) - 5.4);
		}
	}
	//Lean Body Mass
	this.getLBM = function(w, h, a, s, bf) {
		//Par différence
		if(parseInt(a) < 16){	//Pour les enfants on passe par indice de masse corporelle ou BMI
			return Math.round(parseInt(w) - (parseInt(w) * parseInt(bf) / 100));	
		}else{	//Pour les adultes
			if(bf=="0"){ //On ne connait pas le BF alors on utilise l'estimation de Hume (1966)
				//Estimation 2
				if(s == "Homme"){
					return Math.round((0.32810 * w) + (0.33929 * h) - 29.5336);
				}else{
					return Math.round((0.29569 * w) + (0.41813 * h) - 43.2933);
				}
			}else{	//On connait le BF
				return Math.round(parseInt(w) - (parseInt(w) * parseInt(bf) / 100));	
			}
		}
	}
});

