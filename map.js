var tiyIcon = L.icon({
    iconUrl: 'iron-yard-logo.svg',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  });

function createIcon(image, count) {
  var height = Math.round(81 / 3) * count;
  var width = Math.round(59 / 3) * count;
  var icon = L.icon({
    iconUrl: image,
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -1 * height]
  });

  return icon;
}

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
    var popupContent = point.place + "<br>" + point.address + "<br>Votes: " + point.count;
    // this code will need to go in the if statement
    if (point.type == "Eating") {
      var icon = createIcon('food.png', point.count);
      var marker = L.marker(new L.LatLng(latitude, longitude), {icon: icon});
      marker.bindPopup(popupContent);
      marker.addTo(eatingLayer);
    } else if (point.type == "Drinking") {
      var icon = createIcon('beer.png', point.count);
      var marker = L.marker(new L.LatLng(latitude, longitude), {icon: icon});
      marker.bindPopup(popupContent);
      marker.addTo(drinkingLayer);
    };
  };
  eatingLayer.addTo(map);
  drinkingLayer.addTo(map);

  var overlayMaps = {
    "<img src='food.png' height=24>Eating": eatingLayer,
    "<img src='beer.png' height=24>Drinking": drinkingLayer
  };

  L.control.layers(null, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // TIY marker
  L.marker(new L.LatLng(33.7518732,-84.3914068), {icon: tiyIcon})
    .bindPopup("The Iron Yard")
    .addTo(map);

  // GitHub link
  var info = L.control({
    position: 'bottomleft'
  });

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this._div.innerHTML = '<a href="https://github.com/mollietaylor/tiy-lunch" target="_blank">Fork me on GitHub!</a>';
    return this._div;
  };

  info.addTo(map);
}