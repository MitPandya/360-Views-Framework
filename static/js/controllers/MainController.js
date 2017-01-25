/**
 * Created by mhpandya on 11/17/16.
 */
'use strict';

angular.module('360ViewsFramework')
.controller('MainController', function($scope, $sce, $http, $timeout) {

	$scope.file = 'https://lh3.googleusercontent.com/FJVjdRim6AyMX95ZYyuyDBLriOe86zz0Zkae99IGKDEn9lX7mC_Zdr_ai7bo_Ea-OpH50_A04rLtaAoTen2e8KHmI8OKJ3nk2C1AQIB60u2C3HOnE3s6GVioFSL5lxTYbJLge0BXpF2b9MWtkfWaqxu0EspvAtCiRxoj6zvxQ-nxmrx8V6W3FOw_fl5Usk9XnhanmnUBA7_ztX0hlboPJFtErBtohUx1OYQcbpUwPFGuUvs8QhLyt52Dp6vlsHUeXC7QQpdluhZppHAVjx-PY2dYTwCEgjSSaUpKbqzNb1GvpHQpiSuI4QExvYG7F7oxKLWNC8fOu4gjM2Vkew9CI-YmjNO7Jwg_t5O5WXjFOd4UcM8c-xDZWciUhOEek3mCj0XuWOjWrvrDM1X8DClyN7Qy_CfUBZbZrTLw-K0_c34PlKnekxfe5pLg9HNnoJgYQbobcdQQylsSMbWSHwc5A2sLtJmCf03c8ZSU_pskz2CuargOVEDRzqhue1zzEAw1XnrVriUTFWcAtGMibGn9ELCEyI17EVSRDPjwAHhJGvwB4E5aIRNHOE63wh-7NlgIyw=w1920-h1006';
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
				var markerData = data[0].fields.image_marker_data;
				markerData = $scope.parseData(markerData);
				$scope.PSV.setPanorama($scope.file);
				$timeout(function () {
					if($scope.markerData!={}) {
						for (var i = 0; i < markerData.length; i++) {
							$scope.PSV.addMarker(markerData[i]);
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

  	$scope.onClick = function() {
		if($scope.markerType == null) {
			$scope.PSV.addMarker({
				id: '#' + Math.random(),
				longitude: $scope.e.longitude,
				latitude: $scope.e.latitude,
				image: 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png',
				width: 32,
				height: 32,
				anchor: 'bottom center',
				tooltip: 'Generated pin',
				data: {
					generated: true
				}
			});
		}else if($scope.markerType == 'HTML'){
			$scope.PSV.addMarker({
				id: '#' + Math.random(),
			    longitude: $scope.e.longitude,
				latitude: $scope.e.latitude,
			    html: $scope.markerData.displayText,
			    anchor: 'bottom right',
			    style: {
				  maxWidth: $scope.markerData.maxWidth==''?'100px':$scope.markerData.maxWidth,
				  color: $scope.markerData.fontColor==''?'white':$scope.markerData.fontColor,
				  fontSize: $scope.markerData.fontSize==''?'20px':$scope.markerData.fontColor,
				  fontFamily: 'Helvetica, sans-serif',
				  textAlign: 'center'
			    },
			    tooltip: {
				  content: $scope.markerData.tooltipText==''?'An HTML marker':$scope.markerData.tooltipText,
				  position: 'right'
			    },
				data: {
					generated: true
				}
			})
		}else if($scope.markerType == 'Shape'){
			$scope.PSV.addMarker({
			  id: '#' + Math.random(),
			  circle: parseFloat($scope.markerData.radius)==''?20:parseFloat($scope.markerData.radius),
			  x: $scope.e.texture_x,
			  y: $scope.e.texture_y,
			  tooltip: $scope.markerData.tooltipText==''?'A Circle marker':$scope.markerData.tooltipText,
			  data: {
					generated: true
			  }
			})
		}
  	}

	$scope.e;
	$scope.PSV.on('click', function(e) {
		console.log($scope.fileName);
  		$scope.e = e;
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

	$scope.parseData = function(data){
		data = data.replace(/u'/g , "\"").replace(/'/g, "\"");
		data = data.replace(/True/g , "\"True\"").replace(/False/g , "\"False\"");
		data = data.replace(/""True""/g , "\"True\"").replace(/""False""/g , "\"False\"");
		data = JSON.parse(data);
		return data.markers;
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
