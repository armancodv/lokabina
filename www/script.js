var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
	$scope.info_url='http://lokabina.com/';
	$scope.page_back=1;
	$scope.page_number=1;
	$scope.display_player='none';

	if(localStorage.getItem('login_code')==null) {
		localStorage.setItem('username', '');
		localStorage.setItem('login_code', '');
	}
	$scope.username=localStorage.getItem('username');
	$scope.login_code=localStorage.getItem('login_code');

	if(localStorage.getItem("categories")!=null) {
		$scope.categories=JSON.parse(localStorage.getItem("categories"));
	} else {
		$scope.categories=[{'category':'لطفا صبر کنید ...'}];
	}
	$http.get($scope.info_url+'json_categories.php')
		.then(function(response) {
			$scope.categories = response.data;
			localStorage.setItem("categories", JSON.stringify($scope.categories));
		});

	$scope.select_category=function (cat) {
		$scope.category_selected=cat;
		if(localStorage.getItem("sounds"+cat)!=null) {
			$scope.sounds=JSON.parse(localStorage.getItem("sounds"+cat));
		} else {
			$scope.sounds=[{'name':'لطفا صبر کنید ...'}];
		}
		$http.get($scope.info_url+'json_sounds.php?category='+cat)
			.then(function(response) {
				$scope.sounds = response.data;
				localStorage.setItem("sounds"+cat, JSON.stringify($scope.sounds));
			});
	}

	$scope.select_sound=function (sound) {
		$scope.display_player='none';
		$scope.sound_selected=sound;
		if(localStorage.getItem("soundaccess"+sound)!=null) {
			$scope.soundaccess=JSON.parse(localStorage.getItem("soundaccess"+sound));
		} else {
			$scope.soundaccess=[];
		}
		$http.get($scope.info_url+'json_soundaccess.php?id='+sound)
			.then(function(response) {
				$scope.soundaccess = response.data;
				localStorage.setItem("soundaccess"+sound, JSON.stringify($scope.soundaccess));
				if($scope.soundaccess[$scope.sound_selected]['access']==true) {
					$scope.display_player='block';
				} else {
					$scope.display_player='none';
				}
			});
	}

	$scope.check_login=function () {
		if(localStorage.getItem("login_data")!=null) {
			$scope.login_data=JSON.parse(localStorage.getItem("login_data"));
		} else {
			$scope.login_data=[];
		}
		$http.get($scope.info_url+'json_checklogin.php?username='+$scope.username+'&login_code='+$scope.login_code)
			.then(function(response) {
				$scope.login_data = response.data;
				localStorage.setItem("login_data", JSON.stringify($scope.login_data));
			});
	}
	$scope.check_login();

	$scope.insert_logout=function () {
		$scope.login_data=[];
		localStorage.setItem('username', null);
		localStorage.setItem('login_code', null);
		localStorage.setItem('login_data', null);
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

	$scope.gotopage=function (page_number) {
		$scope.page_number=page_number;
		if(page_number==3) {
			$scope.page_back=2;
		} else {
			$scope.page_back=1;
		}
		for(i=1;i<=6;i++) {
			if(i===page_number) {
				document.getElementById('page'+i).style.display='block';
			} else {
				document.getElementById('page'+i).style.display='none';
			}
		}
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}
});
function successHandler (result) {
	var strResult = "";
	if(typeof result === 'object') {
		strResult = JSON.stringify(result);
	} else {
		strResult = result;
	}
	alert("SUCCESS: \r\n"+strResult );
}

function errorHandler (error) {
	alert("ERROR: \r\n"+error );
}

// Click on init button
function init(){
	// Initialize the billing plugin
	alert('test');
	inappbilling.init(successHandler, errorHandler, {showLog:true}, "com.farsitel.bazaar", "ir.cafebazaar.pardakht.InAppBillingService.BIND", "MIHNMA0GCSqGSIb3DQEBAQUAA4G7ADCBtwKBrwDDuij6c28GU1vG7ZNtl+44bDALVWH4vCfHqmFOf6OfAbbgw4Y8U2l+kCecWyu3JBG0kTUiXg3pvE9Lpa2YnyOjO5TV52L3pZ6GJxXpIj9owxHqijEMLooG0bb55tdDynNfuN+fHHsghd/BdLrdjYH2iUmYGUehP5Z9C4ImRg2KC3+cNe8Vt4nSIG+2RKG82LZf0u6xAm9bSIXY0D000TY37EUndx93Yu2cSINsSI8CAwEAAQ==");
}

// Click on purchase button
function buy(){
	// make the purchase
	inappbilling.buy(successHandler, errorHandler,"gas");

}

// Click on ownedProducts button
function ownedProducts(){
	// Initialize the billing plugin
	inappbilling.getPurchases(successHandler, errorHandler);

}

// Click on Consume purchase button
function consumePurchase(){

	inappbilling.consumePurchase(successHandler, errorHandler, "gas");
}

// Click on subscribe button
function subscribe(){
	// make the purchase
	inappbilling.subscribe(successHandler, errorHandler,"infinite_gas");

}

// Click on Query Details button
function getDetails(){
	// Query the store for the product details
	inappbilling.getProductDetails(successHandler, errorHandler, ["gas","infinite_gas"]);

}

// Click on Get Available Products button
function getAvailable(){
	// Get the products available for purchase.
	inappbilling.getAvailableProducts(successHandler, errorHandler);

}

