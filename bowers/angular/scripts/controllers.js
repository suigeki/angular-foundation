myApp.controller('topbarCtrl', function($scope) {
	//alert('topbarCtrl');
});

myApp.controller('headerCtrl', function($scope) {
	//alert('headerCtrl');
});

myApp.controller('footerCtrl', function($scope) {
	//alert('footerCtrl');
}); 

myApp.controller('ctrlForm', function($scope, calculsService, alimentsService, delAlimService, categoriesService, saisonsService){
	
	/*testFtn();
	function testFtn() {
		alert(testService.getData());
	}*/

	//Valeurs par défaut
	$scope.formSize = 190;
	$scope.formWeight = 85;			
	$scope.formAge = 46;
	$scope.formBF = 10;
	$scope.totalSelection = [];
	$scope.totalSelection["Glucides"] = "0";
	$scope.totalSelection["Lipides"] = "0";
	$scope.totalSelection["Protides"] = "0";
	$scope.totalSelection["Kcal"] = "0";
	//$scope.myListAges = [];
	//for (i = 18; i < 91; i++) {
	//	$scope.myListAges.push({"value": i, "text": i});    			
	//}
	$scope.formSexe = "Homme";
	$scope.myListSexes = [{"value": "Homme", "text": "Homme"}, {"value": "Femme", "text": "Femme"}];
	$scope.formActivity = "1.725";
	//$scope.myListActivity = [{"value": "1", "text": "Métabolisme de base"}, {"value": "1.2", "text": "Sédentaire (peu ou pas d'exercice)"}, {"value": "1.375", "text": "Activité légère (exercices légers | sport 1-3 jours/semaine)"}, {"value": "1.55", "text": "Activité modérée (exercices modérés | sport 3-5 jours/semaine)"}, {"value": "1.725", "text": "Très actif (exercices difficiles | sport 6-7 jours par semaine)"}, {"value": "1.9", "text": "Supplémentaires actifs (exercices très difficiles | sport et travail physique ou 2x/jour)"}];
	$scope.myListActivity = [{"value": "1.2", "text": "Sédentaire (peu ou pas d'exercice)"}, {"value": "1.375", "text": "Activité légère (exercices légers | sport 1-3 jours/semaine)"}, {"value": "1.55", "text": "Activité modérée (exercices modérés | sport 3-5 jours/semaine)"}, {"value": "1.725", "text": "Très actif (exercices difficiles | sport 6-7 jours par semaine)"}, {"value": "1.9", "text": "Supplémentaires actifs (exercices très difficiles | sport et travail physique ou 2x/jour)"}];
	$scope.formDiet = "Keto1";
	$scope.myListDiet = [{"value": "Keto1", "text": "Diet cétogène 1"}];

	$scope.BF = 0; //Body Fat mass %
	$scope.LBM = 0; //Lean body mass kg
	$scope.BMR = 0;	//Métabolisme basal
	
	//$scope.BMR = 370 + (21.6 * $scope.LBM); //The Katch-McArdle Formula (Resting Daily Energy Expenditure)

	//Les besoins en protéine dans la keto1 devraient être entre
	//$scope.LBM * 0.6 (mini)
	//$scope.LBM * 1 (maxi)
	//En fonction des activités on peut estimer multiplier

	$scope.listAliments = [];
	loadAliments();

	function loadAliments() {
		alimentsService.getData()
			.success(function(data){
				var x2js = new X2JS();
					$scope.listAliments = x2js.xml_str2json(data); //XML to JSON
					console.log($scope.listAliments);
					$scope.rtnMsg = 'Connexion au WS réussie !';
			})
			.error(function(data){
				$scope.rtnMsg = 'Connexion au WS impossible !';
			});
	}

	$scope.listCategories = [];
	$scope.formCategory = "Légumes";
	loadCategories();

	function loadCategories() {
		categoriesService.getData()
			.success(function(data){
			var x2js = new X2JS();
				$scope.listCategories = x2js.xml_str2json(data); //XML to JSON
				console.log($scope.listCategories);
				$scope.rtnMsg = 'Connexion au WS réussie !';
		})
		.error(function(data){
			$scope.rtnMsg = 'Connexion au WS impossible !';
		});
	}

	$scope.listSaisons = [];
	$scope.formSeason = "Mars";
	loadSaisons();

	function loadSaisons() {
		saisonsService.getData()
			.success(function(data){
			var x2js = new X2JS();
				$scope.listSaisons = x2js.xml_str2json(data); //XML to JSON
				console.log($scope.listSaisons);
				$scope.rtnMsg = 'Connexion au WS réussie !';
		})
		.error(function(data){
			$scope.rtnMsg = 'Connexion au WS impossible !';
		});
	}

	$scope.ftnLoadBF = function() {
		loadBF();
	}
	loadBF();
	function loadBF() {
		if($scope.formBF == "0") {
			$scope.BF = calculsService.getBF($scope.formWeight, $scope.formSize, $scope.formAge, $scope.formSexe);	//weight, height, age, sexe
		}else{
			$scope.BF = parseInt($scope.formBF);   	
		}
		loadLBM(); 	//Masse maigre
	}

	//$scope.ftnLoadLBM = function() {
	//	loadLBM();  //Masse maigre
	//}
	//loadLBM();
	function loadLBM() {
		if($scope.formBF == "0") {
			$scope.LBM = calculsService.getLBM($scope.formWeight, $scope.formSize, $scope.formAge, $scope.formSexe, "0"); 	//weight, height, age, sexe, MG
		}else{
			$scope.LBM = calculsService.getLBM($scope.formWeight, $scope.formSize, $scope.formAge, $scope.formSexe, $scope.formBF); 	//weight, height, age, sexe, MG
		}
		loadBMR();	//Métabolisme de base
	}

	$scope.ftnLoadBMR = function() {
		loadBMR();  //Métabolisme de base								
	}
	//loadBMR();
	function loadBMR() {
		$scope.BMR = calculsService.getBMR($scope.formWeight, $scope.formSize, $scope.formAge, $scope.formSexe, $scope.LBM);	//weight, height, age, sexe
		loadDCI(); //En fonction des activités
	}

	$scope.ftnLoadDCI = function() {
		loadDCI(); //En fonction des activités
	}
	loadDCI();
	function loadDCI() {
		$scope.DCI = [];
		//$scope.DCI.push({"base" : calculsService.getDCI($scope.formActivity)});
		var major = 500;
		$scope.DCI["base"] = calculsService.getDCI($scope.formActivity);
		$scope.DCI["minus1"] = parseInt($scope.DCI.base) - major;
		$scope.DCI["minus2"] = parseInt($scope.DCI.base) - (major * 2);
		$scope.DCI["plus1"] = parseInt($scope.DCI.base) + major;
		$scope.DCI["plus2"] = parseInt($scope.DCI.base) + (major * 2);
		console.log($scope.DCI);
	}

	//$scope.formGlucideFood = '47';
	$scope.ftnView = function(id) {
		var index = getSelectedIndexFood(id);
		console.log(index);
		var food = $scope.listAliments.response.foods[index];
		console.log(food.Food.glucide + ' | ' + food.Food.lipide + ' | ' + food.Food.protide);
		$scope.formIdFood = food.Food.id;
		$scope.formNameFood = food.Food.name;
		$scope.formPortionFood = food.Food.portion;
		$scope.formGlucideFood = food.Food.glucide;
		$scope.formLipideFood = food.Food.lipide;
		$scope.formProtideFood = food.Food.protide;
		$scope.formIgFood = food.Food.ig;
		 //
		$scope.formActiveFood = {
	       value1 : food.Food.active //'1'
	    };
		$scope.FormIdCatFood = food.Food.category_id;
		//alert($scope.formGlucideFood);
	}

	/*$scope.$watch(
			function ftnCalculTotal(id) {
				var index = getSelectedIndexFood(id);
				console.log(index);
				var food = $scope.listAliments.response.foods[index];	
				$scope.totalSelection["Glucides"] = "5";
				$scope.totalSelection["Lipides"] = "4";
				$scope.totalSelection["Protides"] = "3";
				$scope.totalSelection["Kcal"] = "2";
			},
            function() {}
    )*/
	
	$scope.ftnCalculTotal = function(id, item) {
		//var index = getSelectedIndexFood(id);
		//console.log(index);
		//var food = $scope.listAliments.response.foods[index];
		//var id = item.currentTarget.getAttribute('data-id');
		//var value = item.target.value;
		
		//console.log(value);
		var totalGlucides = 0;
		var totalLipides = 0;
		var totalProtides = 0;
		var totalKcal = 0;
		var form = document.forms['rowFoods'];
		console.log(form.length);
		for (i = 0; i < form.length; i++) {
			var idInput = form.elements[i].id;
			var valueInput = form.elements[i].value;
			var index = getSelectedIndexFood(idInput);
			var food = $scope.listAliments.response.foods[index];
			totalGlucides = totalGlucides + (parseInt(food.Food.glucide) * parseInt(valueInput));
			totalLipides = totalLipides + (parseInt(food.Food.lipide) * parseInt(valueInput));
			totalProtides = totalProtides + (parseInt(food.Food.protide) * parseInt(valueInput));
		}
		console.log("G : " + totalGlucides + "L : " + totalLipides + "P : " + totalProtides);
		$scope.totalSelection["Glucides"] = totalGlucides;
		$scope.totalSelection["Lipides"] = totalLipides;
		$scope.totalSelection["Protides"] = totalProtides;
		$scope.totalSelection["Kcal"] = (totalGlucides * 4) + (totalLipides * 9) + (totalProtides * 4);

		//console.log(form.elements.length);
		//for (var champ=0; champ < form.elements.length; champ++) {
			//var x = document.getElementById("myForm").elements[0].value;
			//var element = form.elements[34];
			//console.log(element.value);
			//console.log(document.getElementById(form.elements[34].id).getAttribute
			//console.log(form.elements[34].id);
			//index = getSelectedIndexFood(id);
			//food = $scope.listAliments.response.foods[index];
		//}
				/*for(var i=0; i<$scope.listAliments.response.foods.length; i++){	

					$scope.totalSelection["Glucides"] = parseInt($scope.totalSelection["Glucides"])+parseInt($scope.listAliments.response.foods[i].Food.glucide);
				}
				$scope.totalSelection["Lipides"] = "4";
				$scope.totalSelection["Protides"] = "3";
				$scope.totalSelection["Kcal"] = "2";*/	  
	}

	$scope.ftnSelectEdit = function(id) {

	}

	$scope.ftnDel = function(id) {
		var result = confirm('Etes-vous sûr de vouloir supprimer cet enregistrement ?');
		if(result === true){
			delAlim(id);	   				
		}
		function delAlim(id) {
			delAlimService.deleteData(id)
			.success(function(data){
				//$scope.rtnMsg = 'La suppression de l\'enregistrement a réussie  !';
				console.log(data);
				//loadRoles();
			})
			.error(function(data){
				//$scope.rtnMsg = 'La suppression de l\'enregistrement a échouée  !';
				console.log('La suppression de l\'enregistrement a échouée  !');
			});
		}   	
	}

	$scope.ftnAdd = function() {

	}

	$scope.ftnEdit = function() {

	}

	//Fonction qui retrouve l'index en fonction de l'ID de l'utilisateur
	function getSelectedIndexFood(id){
		console.log($scope.listAliments);
		console.log($scope.listAliments.response.foods.length);
		console.log(id);
		for(var i=0; i<$scope.listAliments.response.foods.length; i++)
			if($scope.listAliments.response.foods[i].Food.id==id)
				return i;
		return -1;
	}

});