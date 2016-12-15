/**
 * Created by mhpandya on 11/17/16.
 */
'use strict';

angular.module('360ViewsFramework')
.controller('MainController', function($scope, $sce) {

$scope.getUrl = function(url) {
    return $sce.trustAsResourceUrl(url);
}

  $scope.PSV = new PhotoSphereViewer({
    panorama: 'https://lh3.googleusercontent.com/FJVjdRim6AyMX95ZYyuyDBLriOe86zz0Zkae99IGKDEn9lX7mC_Zdr_ai7bo_Ea-OpH50_A04rLtaAoTen2e8KHmI8OKJ3nk2C1AQIB60u2C3HOnE3s6GVioFSL5lxTYbJLge0BXpF2b9MWtkfWaqxu0EspvAtCiRxoj6zvxQ-nxmrx8V6W3FOw_fl5Usk9XnhanmnUBA7_ztX0hlboPJFtErBtohUx1OYQcbpUwPFGuUvs8QhLyt52Dp6vlsHUeXC7QQpdluhZppHAVjx-PY2dYTwCEgjSSaUpKbqzNb1GvpHQpiSuI4QExvYG7F7oxKLWNC8fOu4gjM2Vkew9CI-YmjNO7Jwg_t5O5WXjFOd4UcM8c-xDZWciUhOEek3mCj0XuWOjWrvrDM1X8DClyN7Qy_CfUBZbZrTLw-K0_c34PlKnekxfe5pLg9HNnoJgYQbobcdQQylsSMbWSHwc5A2sLtJmCf03c8ZSU_pskz2CuargOVEDRzqhue1zzEAw1XnrVriUTFWcAtGMibGn9ELCEyI17EVSRDPjwAHhJGvwB4E5aIRNHOE63wh-7NlgIyw=w1920-h1006',
    container: 'photosphere'
  });

  $scope.onClick = function() {
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
  }
$scope.e;
$scope.PSV.on('click', function(e) {
  $scope.e = e;
});

  $scope.PSV.on('select-marker', function(marker) {
    if (marker.data && marker.data.generated) {
      $scope.PSV.removeMarker(marker);
    }
  });

})