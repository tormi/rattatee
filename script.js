var map = new L.Map('map', {
    center: [59.3277, 24.5351],
    zoom: 13
});

map.attributionControl.setPrefix('');

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Aluskaart &copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var pohi = L.tileLayer.wms("http://kaart.maaamet.ee/wms/alus-geo?", {
    format: 'image/png',
    transparent: true,
    minZoom: 15,
    layers: 'pohi_vv',
    crs: L.CRS.EPSG4326,
    attribution: 'Põhikaart &copy; <a href="http://geoportaal.maaamet.ee/est/Teenused/Avalik-WMS-teenus-p65.html" target="_blank">Maa-amet</a>'
});

var orto = L.tileLayer.wms("http://kaart.maaamet.ee/wms/alus-geo?", {
    format: 'image/png',
    transparent: true,
    layers: 'EESTIFOTO',
    crs: L.CRS.EPSG4326,
    attribution: 'Ortofoto &copy; <a href="http://geoportaal.maaamet.ee/est/Teenused/Avalik-WMS-teenus-p65.html" target="_blank">Maa-amet</a>'
});

var hybriid = L.tileLayer.wms("http://kaart.maaamet.ee/wms/alus-geo?", {
    format: 'image/png',
    transparent: true,
    layers: 'HYBRID',
    crs: L.CRS.EPSG4326
});
var kataster = L.tileLayer.wms("http://kaart.maaamet.ee/wms/alus-geo?", {
    format: 'image/png',
    transparent: true,
    minZoom: 15,
    layers: 'TOPOYKSUS_6569',
    crs: L.CRS.EPSG4326
});

var sauevyp = L.tileLayer('https://mapwarper.net/maps/tile/17658/{z}/{x}/{y}.png', {
    attribution: '<a href="http://sauevald.kovtp.ee/et/uldplaneering" target="_blank">Saue valla üldplaneering 2016</a>',
    opacity: 0.8
});
var sauelyp = L.tileLayer('https://mapwarper.net/maps/tile/22978/{z}/{x}/{y}.png', {
    attribution: '<a href="http://saue.kovtp.ee/uldplaneering" target="_blank">Saue linna üldplaneering 2010</a>'
});
var stravarunning = L.tileLayer('https://globalheat.strava.com/tiles/running/color2/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.strava.com/" target="_blank">STRAVA</a>'
});
var stravacycling = L.tileLayer('https://globalheat.strava.com/tiles/cycling/color3/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.strava.com/" target="_blank">STRAVA</a>'
});

L.control.locate({
    strings: {
        title: "Näita minu asukohta"
    }
}).addTo(map);

function formatJSON(rawjson) {
    var json = {},
        res, key, loc = [];
    res = rawjson.addresses;
    for (var i in res) {
        key = res[i].ipikkaadress;
        loc = L.latLng(res[i].viitepunkt_b, res[i].viitepunkt_l);
        json[key] = loc;
    }
    return json;
};

map.addControl(new L.Control.Search({
    url: 'https://inaadress.maaamet.ee/inaadress/gazetteer?features=KATASTRIYKSUS&address={s}',
    jsonpParam: 'callback',
    formatData: formatJSON,
    textPlaceholder: 'Otsi katastriüksuse aadressi',
    marker: L.circleMarker([0, 0], {
        radius: 20,
        color: "#ffcc00"
    }),
    autoCollapse: true,
    autoType: false,
    minLength: 2,
    zoom: 18
}));

var allMapLayers = {
    'osm': osm,
    'pohi': pohi,
    'orto': orto,
    'hybriid': hybriid,
    'kataster': kataster,
    'sauevyp': sauevyp,
    'sauelyp': sauelyp,
    'stravarunning': stravarunning,
    'stravacycling': stravacycling
};

L.control.layers({
    'OpenStreetMap': osm,
    'Põhikaart (z15+)': pohi,
    'Ortofoto': orto
}, {
    'Hübriidkaart': hybriid,
    'Katastripiirid (z15+)': kataster,
    'Saue valla ÜP': sauevyp,
    'Saue linna ÜP': sauelyp,
    'Strava jalgsi': stravarunning,
    'Strava rattaga': stravacycling
}, {
    position: 'topleft'
}).addTo(map);


var info = L.control();
info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this._div.innerHTML = (
        "<h1><a href=\'\/rattatee-tallinn-saue-keila\' title=\'Rattatee Tallinn - Saue - Keila\'>Rattatee Tallinn - Saue - Keila</a></h1><a href=\'https:\/\/medium.com/\saue/\kiirtee-saue-linnast-keilasse-ja-tallinna-5529e1cd69f2\' title=\'Idee tutvustus\' target=\'_blank\'>Idee tutvustus</a> | <a href=\'https:\/\/medium.com/\@tormi\' title=\'Kaardi teostus: Tormi Tabor\' target=\'_blank\'>Teostus: Tormi Tabor</a> | <a href=\'https:\/\/github.com\/liikuvus\/rattatee-tallinn-saue-keila\/issues\' title=\'Anna tagasisidet\' target=\'_blank\'>Tagasiside</a>"
    );
    return this._div;
};
info.addTo(map);

$(function() {
    $("#slider").slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 100,
        value: 80,
        slide: function(e, ui) {
            sauevyp.setOpacity(ui.value / 100);
            sauelyp.setOpacity(ui.value / 100);
            stravarunning.setOpacity(ui.value / 100);
            stravacycling.setOpacity(ui.value / 100);
        }
    });
});

L.hash(map, allMapLayers);
