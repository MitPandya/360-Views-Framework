/**
 * Created by mhpandya on 11/17/16.
 */
'use strict';

angular.module('360ViewsFramework')
.controller('MainController', function($scope, $sce, $http, $timeout,$mdDialog) {

	$scope.file = 'https://iiif-staging02.lib.ncsu.edu/360/creativity_studio.jpg';
	$scope.serverURL = 'https://iiif-staging02.lib.ncsu.edu/360/';
	$scope.imageList = [];
	$scope.getUrl = function(url) {
    	return $sce.trustAsResourceUrl(url);
	}

	$scope.PSV = null;
	$scope.markerType = null;

	$scope.onImageChange = function(){
		$http({
  		method: 'GET',
  		url: '/get_image',
		params: {'name':$scope.fileName}
		}).then(function successCallback(response) {
			$scope.PSV.clearMarkers();
			if (response.data.image != null) {
				var data = JSON.parse(response.data.image);
				$scope.fileName = data[0].fields.image_name;
				//$scope.file = data[0].fields.image_location;
				var temp = data[0].fields.image_marker_data;
				$scope.markerData = $scope.parseData(temp);
				$scope.PSV.setPanorama($scope.file);
				$timeout(function () {
					if($scope.markerData!={}) {
						for (var i = 0; i < $scope.markerData.length; i++) {
							$scope.PSV.addMarker($scope.markerData[i]);
						}
					}
				}, 1000);
			} else {
				$scope.PSV.setPanorama($scope.file);
			}
		}, function errorCallback(response) {
			console.log('error');
			$scope.PSV.setPanorama($scope.file);
		});

	}

	$scope.PSV = new PhotoSphereViewer({
		panorama: $scope.file,
		container: 'photosphere'
	})

  	$scope.onClick = function(event) {
		if(event.srcElement.localName == 'svg') {
			if ($scope.markerType == null) {
				$scope.PSV.addMarker({
					id: '#' + Math.random(),
					longitude: $scope.e.longitude,
					latitude: $scope.e.latitude,
					image: 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png',
					width: 32,
					height: 32,
					anchor: 'bottom center',
					tooltip: 'Generated pin',
					layer: 'library',
					data: {
						generated: true
					}
				});
			} else if ($scope.markerType == 'HTML') {
				$scope.PSV.addMarker({
					id: '#' + Math.random(),
					longitude: $scope.e.longitude,
					latitude: $scope.e.latitude,
					html: $scope.markerData.displayText,
					anchor: 'bottom right',
					style: {
						maxWidth: $scope.markerData.maxWidth == '' ? '100px' : $scope.markerData.maxWidth,
						color: $scope.markerData.fontColor == '' ? 'white' : $scope.markerData.fontColor,
						fontSize: $scope.markerData.fontSize == '' ? '20px' : $scope.markerData.fontColor,
						fontFamily: 'Helvetica, sans-serif',
						textAlign: 'center'
					},
					tooltip: {
						content: $scope.markerData.tooltipText == '' ? 'An HTML marker' : $scope.markerData.tooltipText,
						position: 'right'
					},
					layer: 'library',
					data: {
						generated: true
					}
				})
			} else if ($scope.markerType == 'Shape') {
				$scope.PSV.addMarker({
					id: '#' + Math.random(),
					circle: parseFloat($scope.markerData.radius) == '' ? 20 : parseFloat($scope.markerData.radius),
					x: $scope.e.texture_x,
					y: $scope.e.texture_y,
					tooltip: $scope.markerData.tooltipText == '' ? 'A Circle marker' : $scope.markerData.tooltipText,
					layer: 'library',
					data: {
						generated: true
					}
				})
			}
		}
  	}

	$scope.e;
	$scope.PSV.on('click', function(e) {
  		$scope.e = e;
	});
	$scope.layer = ""
	$scope.handleClick = function(event){
		if(event.srcElement.className == "psv-layers-list-name"){
			$scope.layer = event.srcElement.innerText;
		}
	}
	// filter markers based on layer
	$scope.$watch('layer', function (newValue, oldValue, scope) {
    	console.log('layer '+ newValue +' '+ oldValue);
		if(newValue != oldValue) {
			$scope.filterData(newValue);
		}
	});

  	$scope.PSV.on('select-marker', function(marker) {
    	if (marker.data && marker.data.generated) {
      		$scope.PSV.removeMarker(marker);
    	}
  	});

	$scope.getMarkerData = function(){
		var marker_json = {};
		var markers = [];
  		for (var id in $scope.PSV.hud.markers) {
    		var m = $scope.PSV.hud.markers[id];
			console.log(m.id);
			var marker = {};
			marker.id = m.id;
			marker.longitude = m.longitude;
			marker.latitude = m.latitude;
			marker.image = m.image;
			marker.width = m.width;
			marker.height = m.height;
			marker.anchor = m.anchor;
			marker.tooltip = m.tooltip;
			marker.data = m.data;
			marker.html = m.html;
			marker.circle = m.circle;
			marker.x = m.x;
			marker.y = m.y;
			marker.style = m.style;
			marker.layer = m.layer;
			markers.push(marker);
			marker_json.markers = markers;
  		}
		return marker_json;
	};

	$scope.saveImageToBackend = function(){
			$scope.image = {};
			$scope.image.name = $scope.fileName;
			$scope.image.path = $scope.file;
			$scope.image.marker_json = $scope.getMarkerData();
			$http({
			method: 'POST',
			url: '/save_image',
			data: JSON.stringify({'image':$scope.image}),
			headers: {'Content-Type': 'application/json'}
		}).then(function successCallback(response) {
			console.log('response'+response);
			// this callback will be called asynchronously
			// when the response is available
		}, function errorCallback(response) {
			console.log('error');
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	}

	//method to fetch image list
	$scope.showImageList = function(){
		console.log('inside showImageList');
		$http({
  		method: 'GET',
  		url: '/fetch_image_list'
		}).then(function successCallback(response) {
			$scope.imageList = response.data.image_list;
			console.log($scope.imageList);
			$scope.showDialog();
		}, function errorCallback(response) {
			console.log('error fetching image list');
		});
	}

	$scope.showDialog = function() {
		$mdDialog.show({
		  controller: DialogController,
		  templateUrl: '/static/views/image_dialog.html',
		  parent: angular.element(document.body),
		  clickOutsideToClose:true,
		  locals:{dataToPass: $scope.imageList},
		  fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		})
		.then(function(answer) {
		  	console.log(answer);
		  	$scope.fileName = answer;
			$scope.file = $scope.serverURL+answer;
			$scope.onImageChange();
		}, function() {
		  console.log('You cancelled the dialog.');
		});
  	};

  	function DialogController($scope, $mdDialog, dataToPass) {
		$scope.hide = function() {
		  $mdDialog.hide();
		};

		$scope.cancel = function() {
		  $mdDialog.cancel();
		};

		$scope.imageList = dataToPass;

		$scope.answer = function(answer) {
		  $mdDialog.hide(answer);
		};
  	}

	$scope.parseData = function(data){
		data = data.replace(/u'/g , "\"").replace(/'/g, "\"");
		data = data.replace(/True/g , "\"True\"").replace(/False/g , "\"False\"");
		data = data.replace(/""True""/g , "\"True\"").replace(/""False""/g , "\"False\"");
		data = JSON.parse(data);
		return data.markers;
	}

	$scope.filterData = function(layerFilter){
		if(layerFilter != null && layerFilter != ""){
			for (var i = 0; i < $scope.markerData.length ; i++ ){
				if($scope.markerData[i].layer != layerFilter){
					$scope.PSV.hideMarker($scope.markerData[i]);
				}
				else if($scope.markerData[i].layer == layerFilter){
					$scope.PSV.showMarker($scope.markerData[i]);
				}
			}
		}
	}

})
angular.module('360ViewsFramework')
	.directive('chooseFile', function() {
    return {
      link: function (scope, elem, attrs) {
        var button = elem.find('button');
        var input = angular.element(elem[0].querySelector('input#fileInput'));
        button.bind('click', function() {
          input[0].click();
        });
        input.bind('change', function(e) {
          scope.$apply(function() {
            var files = e.target.files;
            if (files[0]) {
				var file = files[0];
              	scope.fileName = file.name;
				var path = (window.URL || window.webkitURL).createObjectURL(file);
				scope.file = path;
			  	scope.onImageChange();
            } else {
              scope.fileName = null;
            }
          });
        });
      }
    };
  });
