/**
 * Created by mhpandya on 11/17/16.
 */
'use strict';

angular.module('360ViewsFramework')
.controller('MainController', function($scope, $sce) {

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.url = 'https://lh3.googleusercontent.com/zQyv2haHtvTkZPjoxVClTrrSrF5cr5tRzazo3yEOvBVmIF7tDNHjPmXUUshXTEMvbCu2ZBUInc1ulup0oIbT0YziROW_zWPQMvUp2UOXWDPSxHMCA6z1nt-NNVGOnoMkwHFj7xrZSeb6q0cZQ3ki3AaJUVeYFvOh3vDomAfxuwkyii06mUTfisz9ShswFSG2klf_5NS8tO0gBS629LzCs3sTmU0yw0D2qlqiYH1DY6Yi_1_p5wpDraYiRsY6ELZxxlv4wW_3GZGEZpJSRBs6-BF0_hgW5yGjrOEWh615rrP91ZcF3Ouz5svR8BCIFDA09K2kds0hFFSFXBmqx9dYseurrrKltuC4tkSowNMrNauocsdCQz3Mvi5xboWP6-dYT1Of04RXCUVGLYEEmQUFLG8RRyl4ZgRh7dW8bmIay1uCi9VcKSAyGvqryotUG6taNza3a-d6IdaRLyuT7v598dO7lizDAlXOTLq0LFcN3uw-Od25x9uhEiSqD_F-7CTSi14VtcxHXcnvscoRqPT8USFbizO9DuVf9wS6C7k8GfjQH2mWlFgL66pRx_4Mx3FOQw=w1920-h1006';

    var viewer = pannellum.viewer('panorama', {
					"default": {
						"firstScene": "circle",
						"sceneFadeDuration": 1000,
                        "autoRotate" : -2
					},

					"scenes": {
						"circle": {
							"type": "equirectangular",
							"panorama": $scope.trustSrc($scope.url),
							"hotSpots": [
								{
									"pitch": -2.1,
									"yaw": 132.9,
									"type": "scene",
									"text": "Spring House or Dairy",
									"sceneId": "house"
								}
							]
						}
					}
				});

			var upMove = function()
			{
				try
				{
					viewer.setPitch(viewer.getPitch() + 5);
				}
				catch(e)
				{
					console.log(e);
				}
			}

			var rightMove = function()
			{
				try
				{
					viewer.setYaw(viewer.getYaw() + 5);
				}
				catch(e)
				{
					console.log(e);
				}
			}

			var downMove = function()
			{
				try
				{
					viewer.setPitch(viewer.getPitch() - 5);
				}
				catch(e)
				{
					console.log(e);
				}
			}

			var leftMove = function()
			{
				try
				{
					viewer.setYaw(viewer.getYaw() - 5);
				}
				catch(e)
				{
					console.log(e);
				}
			}

			var swapImage = function()
			{
				try
				{
					var inv_Pitch = viewer.getPitch();
					var inv_Yaw = viewer.getYaw();
					var inv_Hfov = viewer.getHfov();

					if (viewer.getScene() == 'circle')
					{
						viewer.loadScene('house',inv_Pitch,inv_Yaw,inv_Hfov)
					}
					else
					{
						viewer.loadScene('circle',inv_Pitch,inv_Yaw,inv_Hfov)
					}
				}
				catch(e)
				{

				}
			}

})