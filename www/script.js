var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
	$scope.info_url='http://lokabina.com/';

	if(localStorage.getItem('login_code')==null) {
		localStorage.setItem('username', '');
		localStorage.setItem('login_code', '');
	}
	$scope.username=localStorage.getItem('username');
	$scope.login_code=localStorage.getItem('login_code');

	$scope.categories=[{'category':'لطفا صبر کنید ...'}];
	$http.get($scope.info_url+'json_categories.php')
		.then(function(response) {
			$scope.categories = response.data;
		});

	$scope.select_category=function (cat) {
		$scope.category_selected=cat;
		$scope.sounds=[{'name':'لطفا صبر کنید ...'}];
		$http.get($scope.info_url+'json_sounds.php?category='+cat)
			.then(function(response) {
				$scope.sounds = response.data;
			});
	}

	$scope.select_sound=function (sound) {
		$scope.sound_selected=sound;
		$scope.soundaccess=[];
		$http.get($scope.info_url+'json_soundaccess.php?id='+sound)
			.then(function(response) {
				$scope.soundaccess = response.data;
			});
	}

	$scope.check_login=function () {
		$scope.login_data=[];
		$http.get($scope.info_url+'json_checklogin.php?username='+$scope.username+'&login_code='+$scope.login_code)
			.then(function(response) {
				$scope.login_data = response.data;
			});
	}
	$scope.check_login();

	$scope.insert_logout=function () {
		$scope.login_data=[];
		localStorage.setItem('username', null);
		localStorage.setItem('login_code', null);
		$scope.username=null;
		$scope.login_code=null;
		$scope.check_login();
	}

	$scope.check_password=function (username,password) {
		$scope.password_data=[];
		$http.get($scope.info_url+'json_checkpassword.php?username='+username+'&password='+password)
			.then(function(response) {
				$scope.password_data = response.data;
				localStorage.setItem('username', $scope.password_data['username']);
				localStorage.setItem('login_code', $scope.password_data['login_code']);
				$scope.username=$scope.password_data['username'];
				$scope.login_code=$scope.password_data['login_code'];
				$scope.check_login();
			});
	}

	$scope.purchase=function (sound) {
		$scope.purchase_data=[];
		$http.get($scope.info_url+'json_purchases.php?username='+$scope.username+'&login_code='+$scope.login_code+'&id='+sound)
			.then(function(response) {
				$scope.purchase_data = response.data;
				$scope.select_sound(sound);
			});
	}

	$scope.insert_user=function (username,password,repassword,firstname,lastname,email,phone) {
		$scope.signup_data=[];
		$http.get($scope.info_url+'json_signup.php?username='+username+'&password='+password+'&repassword='+repassword+'&firstname='+firstname+'&lastname='+lastname+'&gender=1&email='+email+'&phone='+phone)
			.then(function(response) {
				$scope.signup_data = response.data;
				$scope.check_password(username,password);
			});
	}

	$scope.play_sound=function (sound_url) {
		audio = new Audio(sound_url);
		audio.play();
	}
});

function gotopage(page_number) {
	for(i=1;i<=6;i++) {
		if(i===page_number) {
			document.getElementById('page'+i).style.display='block';
		} else {
			document.getElementById('page'+i).style.display='none';
		}
	}
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}