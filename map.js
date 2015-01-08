var tiyIcon = L.icon({
    iconUrl: 'iron-yard-logo.svg',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  });

var eatIcon = L.AwesomeMarkers.icon({
  icon: 'cutlery',
  prefix: 'fa',
  markerColor: 'blue'
});

var drinkIcon = L.AwesomeMarkers.icon({
  icon: 'beer',
  prefix: 'fa',
  markerColor: 'darkgreen'
});

var map = L.map('map', {
  center: new L.LatLng(33.7518732,-84.3914068), 
  zoom: 15
});

new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '<a href="http://proximityviz.com/">Proximity Viz</a> | &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(map);

window.onload = function() { init() };

var eatingLayer = L.geoJson(null);
var drinkingLayer = L.geoJson(null);

var spreadsheet = 'https://docs.google.com/spreadsheet/pub?key=1BE4-odCRrcTA1WOFFWsWLscihNzvS5HVYoYjMr7uIS0&output=html';

function init() {
  Tabletop.init( { key: spreadsheet,
                   callback: createMarkers,
                   simpleSheet: true } )
}

function createMarkers(data, tabletop) {
  var pattLat = /,.*/;
  var pattLon = /.*,+/;
  for (var i = 0; i < data.length; i++) {
    var point = data[i];
    var coordinates = point.coordinates;
    var latitude = coordinates.replace(pattLat, "");
    var longitude = coordinates.replace(pattLon, "");
    var popupContent = point.place + "<br>" + point.address;
    // this code will need to go in the if statement
    if (point.type == "Eating") {
      var marker = L.marker(new L.LatLng(latitude, longitude), {icon: eatIcon});
      marker.bindPopup(popupContent);
      marker.addTo(eatingLayer);
    } else if (point.type == "Drinking") {
      var marker = L.marker(new L.LatLng(latitude, longitude), {icon: drinkIcon});
      marker.bindPopup(popupContent);
      marker.addTo(drinkingLayer);
    };
  };
  eatingLayer.addTo(map);
  drinkingLayer.addTo(map);

  var overlayMaps = {
    "Eating": eatingLayer,
    "Drinking": drinkingLayer
  };

  L.control.layers(null, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // TIY marker
  L.marker(new L.LatLng(33.7518732,-84.3914068), {icon: tiyIcon})
    .bindPopup("The Iron Yard")
    .addTo(map);
}