'use strict';

/**
 * @ngdoc function
 * @name gisMapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gisMapApp
 */
angular.module('gisMapApp')
  .controller('MainCtrl', ['$mdDialog','$scope','$localStorage',function ($mdDialog, $scope, $localStorage) {
    var vm = this;
    
    vm.editing = false;
    
    vm.actionEdit = function(){
        vm.editing = !vm.editing;
    }
    
    
    var customMarker = L.Marker.extend({
       options: { 
          title: '',
          desc: ''
       }
        
    });  
      
    var map = L.map('map',{center: [40.965, -5.664],zoom: 16});
    
    var satelite = L.esri.basemapLayer('Imagery').addTo(map);
    
    var sateliteLabels = L.esri.basemapLayer('ImageryLabels').addTo(map);
    
    var baseMaps = {};
      
    vm.storage = $localStorage;
    vm.layerGroup1 = L.layerGroup();
    vm.layerGroup2 = L.layerGroup();
    vm.layerGroup3 = L.layerGroup();  
      
    if(vm.storage.markers === undefined){
        vm.storage.markers = [];
    }else{
        angular.forEach(vm.storage.markers,function(value){
            
            var myIcon;
            
            switch(value.properties.type){
                case "1":
                    myIcon = new L.AwesomeMarkers.icon({icon: 'thumbs-up', prefix: 'glyphicon', markerColor: 'cadetblue',iconColor:'#F5A9E1'});   
                    break;
                case "2":
                    myIcon = new L.AwesomeMarkers.icon({icon: 'cutlery', prefix: 'glyphicon', markerColor: 'green',iconColor:'black'});      
                    break;
                case "3":
                    myIcon = new L.AwesomeMarkers.icon({icon: 'star', prefix: 'glyphicon', markerColor: 'blue',iconColor:'white'});        
                    break;
            }  
            
            var options = {
                    'title':value.properties.title,
                    'desc':value.properties.desc,
                    'latLng':value.properties.latLng,
                    'icon':myIcon
                };
            
            var marker = new L.geoJSON(value,{
                pointToLayer: function (feature, latlng) {
                    return new customMarker(latlng, options);
                },  
                'title':value.properties.title,
                   
                'desc':value.properties.desc,
                    
                'latLng':value.properties.latLng,
            });
            
            
            marker.bindPopup("<h4>"+value.properties.title+"</h4><p>"+value.properties.desc+"</p>");
            
            switch(value.properties.type){
                case "1":
                        vm.layerGroup1.addLayer(marker).addTo(map);
                        break;
                case "2":
                        vm.layerGroup2.addLayer(marker).addTo(map);
                        break;
                case "3":
                        vm.layerGroup3.addLayer(marker).addTo(map);
                        break;
            }           
        });
    }
    

    
    var overlayMaps = {
        'Ocio':vm.layerGroup1,
        'Restauración':vm.layerGroup2,
        'Punto de interés':vm.layerGroup3
    };
    
    vm.overlays = overlayMaps;
      
    var control = L.control.layers(baseMaps, overlayMaps,{collapsed:false}).addTo(map);
    
    map.on('overlayadd',function(e){
        console.log(e);
    });  
    map.on('overlayremove',function(e){
        console.log(e);
    });  
    map.on('click', function(e){
            addMarker(e);
    });
    

      
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

   /* L.geoJSON(someGeojsonFeature, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    })  */
      
    function addMarker(e){
        if(vm.editing){
            $mdDialog.show({
              controller: DialogController,
              templateUrl: 'views/dialog1.tmpl.html',
              parent: angular.element(document.body),
              //targetEvent: ev,
              clickOutsideToClose:false,
              fullscreen: true // Only for -xs, -sm breakpoints.
            }).then(function(form){
                 var myIcon;
            
                switch(form.type){
                    case "1":
                        myIcon = new L.AwesomeMarkers.icon({icon: 'thumbs-up', prefix: 'glyphicon', markerColor: 'blue',iconColor:'black'});   
                        break;
                    case "2":
                        myIcon = new L.AwesomeMarkers.icon({icon: 'cutlery', prefix: 'glyphicon', markerColor: 'green',iconColor:'black'});      
                        break;
                    case "3":
                        myIcon = new L.AwesomeMarkers.icon({icon: 'star', prefix: 'glyphicon', markerColor: 'blue',iconColor:'white'});        
                        break;
                }  

                var options = {
                        'title':form.name,
                        'desc':form.desc,
                        'latLng':e.latlng,
                        'type':form.type,
                        'icon':myIcon
                    };
                
                var marker = new customMarker(e.latlng,options);
                
                marker.bindPopup("<h4>"+form.name+"</h4><p>"+form.desc+"</p>");
                
                var jsonMarker = marker.toGeoJSON();
                
                jsonMarker.properties = {
                    'title':form.name,
                    'desc':form.desc,
                    'latLng':e.latlng,
                    'type':form.type
                };
                
                vm.storage.markers.push(jsonMarker);                 
                
                switch(form.type){
                    case "1":
                        vm.layerGroup1.addLayer(marker).addTo(map);
                        break;
                    case "2":
                        vm.layerGroup2.addLayer(marker).addTo(map);
                        break;
                    case "3":
                        vm.layerGroup3.addLayer(marker).addTo(map);
                        break;
                }
                
                
                vm.actionEdit();
                
            },function(){
                vm.actionEdit()
            });

        }
    }
    function DialogController($scope, $mdDialog) {
        $scope.form = {};
        $scope.form.type = "1";
        
        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
  }
      
  vm.fly = fly;   
  function fly(point){
        map.panTo(point.options.pointToLayer().options.latLng);
        point.openPopup();
  }  
  }]);
