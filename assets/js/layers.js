var layers = {}; //Global layers object
var map;

function createMapboxOSM()
{
    layers.mapboxOSM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/spatialnetworks.map-6l9yntw9/{z}/{x}/{y}.png", {
                maxZoom: 19,
                subdomains: ["a", "b", "c", "d"],
                attribution: 'Basemap <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox © OpenStreetMap</a>'
            });

}

function createMapboxSAT()
{
    layers.mapboxSAT =  L.tileLayer("http://{s}.tiles.mapbox.com/v3/spatialnetworks.map-xkumo5oi/{z}/{x}/{y}.jpg", {
                maxZoom: 20,
                subdomains: ["a", "b", "c", "d"],
                attribution: 'Basemap <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox © OpenStreetMap</a>'
            });

}

function createEsriTopo()
{
    layers.esriTopo = L.esri.tiledMapLayer({
					url: 'http://tiles.arcgis.com/tiles/I97nVdg0OgwKVCpk/arcgis/rest/services/Basemap/MapServer',
					opacity: 1.0
				});
}

function createAnnotations()
{
    layers.annotation = L.esri.dynamicMapLayer({
					url: 'http://8.35.16.158/arcgisserver/rest/services/parcelanno_dyn/MapServer',
					opacity: 1.0
				});
}



function createReference()
{
    var url = "https://cartomike.carto.com/api/v2/viz/38839bae-a855-11e6-97fa-0e233c30368f/viz.json";
      cartodb.createLayer(map,url).on('done', function (layer) {
                     layer.setZIndex(8);
                     layers.cartoReference = layer;
});
}

function createWaterMeters()
{
    layers.waterMeters = L.esri.dynamicMapLayer({
					url: 'http://8.35.16.158/arcgisserver/rest/services/RedBayWater/MapServer/',
          layers: [0]
				});
}

function createWaterValves()
{
    layers.waterValves = L.esri.dynamicMapLayer({
					url: 'http://8.35.16.158/arcgisserver/rest/services/RedBayWater/MapServer/',
          layers: [1]
				});
}

function createWaterHydrants()
{
    layers.waterHydrants = L.esri.dynamicMapLayer({
					url: 'http://8.35.16.158/arcgisserver/rest/services/RedBayWater/MapServer/',
          layers: [2]
				});
}

function createLayers(onFinished)
{
        createWaterMeters();
        createWaterValves();
        createWaterHydrants();
        createMapboxOSM();
        createMapboxSAT();
        createEsriTopo();
        createAnnotations();
		    createReference();
        addArgGisSearch();
        onFinished();
}

function addMeasureTool()
{
	var measureControl = new L.control.measure({
		position: 'topright',
		primaryLengthUnit: 'feet',
		secondaryLengthUnit: 'miles',
		primaryAreaUnit: 'acres',
		secondaryAreaUnit: 'sqfeet',
		activeColor: '#ABE67E',
		completedColor: '#C8F2BE'
		});

		measureControl.addTo(map);
}


function createMap()
{
    map = L.map("map", {
        zoom: 12,
        center: [34.438117, -87.954238],
       // layers: [layers.mapboxOSM]
    });
    console.log(map);
    var hash = new L.Hash(map);
}

function addArgGisSearch()
{
  var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();

var searchControl = L.esri.Geocoding.geosearch({
  providers: [
    arcgisOnline,
    L.esri.Geocoding.featureLayerProvider({
      url: 'http://8.35.16.158/arcgisserver/rest/services/RedBayWater/FeatureServer/0 ',
      label: "Water accounts",
      searchFields: ['ACCOUNTID', 'LOCATIONID'],
      bufferRadius: 5000,
      formatSuggestion: function(feature){
        return feature.properties.ACCOUNTID + ' - ' + feature.properties.LOCATIONID;
      }
    })
  ]
}).addTo(map);
}




function getLayerFromId(id)
{
    alert(id);
}

$(function(){
    createMap();
    createLayers(function(){
       map.addLayer(layers.mapboxOSM);
    });

})

$(function()
{
    $("input[name='overlayLayers']").trigger("change");
});

    $("input[name='basemapLayersRadio']").change(function () {


       // Remove unchecked layers
        $("input:radio[name='basemapLayersRadio']:not(:checked)").each(function () {
            var theLayer = layers[$(this).attr('id')];
            if (theLayer && map.hasLayer(theLayer))
            {
                map.removeLayer(theLayer);
            }

        });
                    // Add checked layer
        $("input:radio[name='basemapLayersRadio']:checked").each(function () {
            var theLayer = layers[$(this).attr('id')];
            if (theLayer)
            {
                map.addLayer(theLayer);
            }
        });

    });

    $("input[name='overlayLayers']").change(function () {
                    // Remove unchecked layers
        $("input:checkbox[name='overlayLayers']:not(:checked)").each(function () {
                       var theLayer = layers[$(this).attr('id')];
                        if (theLayer && map.hasLayer(theLayer))
                         {
                            map.removeLayer(theLayer);
                        }
        });


                    // Add checked layer

                    $("input:checkbox[name='overlayLayers']:checked").each(function () {
                        var theLayer = layers[$(this).attr('id')];
                        if (theLayer){
                         map.addLayer(theLayer);
                        }
                    });

                });
