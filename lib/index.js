var request = require('request');
var qs = require('querystring');
var md5 = require('MD5');
var _ = require('underscore');

function BaiduMap(config){
  this.ak = config.ak;
  this.sk = config.sk;
  this.apiBase = "http://api.map.baidu.com";
}

BaiduMap.prototype._request = function(url, data, callback){
  var ak = this.ak;
  var sk = this.sk;

  function generateSn(data){
    var keys = qs.stringify(data);
    return md5(encodeURIComponent(url + '?' + keys + sk));
  }

  var base = this.apiBase;
  var defaultData = {
    output: "json",
    ak: ak,
    timestamp: +new Date(),
  };
  data = _.extend(defaultData,data);
  data.sn = generateSn(data);


  request.get( this.apiBase + url + "?" + qs.stringify(data), function(err, resp, body){
    callback(err, body);
  });
}

var api_list = {
  geocoder : "/geocoder/v2/",
  direction : "/direction/v1",
  directionRouteMatrix: "/direction/v1/routematrix",
  locationIp : "/location/ip",
  geoconv: "/geoconv/v1/",
  placeSuggestion : "/place/v2/suggestion/",
  placeSearch : "/place/v2/search",
  placeEventSearch: "/place/v2/eventsearch",
  placeEventDetail: "/place/v2/eventdetail"
}

for(var api in api_list){
  (function(funcName, url){
    BaiduMap.prototype[funcName] = function(params, callback){
      this._request(url, params, callback);
    }
  })(api, api_list[api]);
}

module.exports = BaiduMap;