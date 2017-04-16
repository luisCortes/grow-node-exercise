var _ = require('underscore');

var checkData = exports.checkData = function(counter, cb, data){
  if(data.characters && data.planets){
    cb(false);
  }else if(counter >= 9){
    cb(true);
  }else{
    setTimeout(function() {
      counter++;
      checkData(counter, cb, data);
    }, 1500);
  }
};

exports.getNumberOfPages = function(resultLength){
  var pagesSize = 10;
  return Math.ceil(resultLength/pagesSize)
};

exports.getNextPageUrl = function(req, numberOfPages){
  var url = "http://" + req.headers.host + req.url;
  var queries = "";
  if(numberOfPages > 1){
    var splitUrl = url.split("?");
    if(req.query.page){
      if(req.query.page < numberOfPages){
        for (var property in req.query) {
          if(property != "page"){
            queries += "&" + property + "=" + req.query[property];
          }
        }
        if(_.size(req.query) > 1){
          return splitUrl[0] + "?" + queries.substring(1) + "&page=" + (parseInt(req.query.page) + 1);
        }
        return splitUrl[0] + "?" + queries.substring(1) + "page=" + (parseInt(req.query.page) + 1);
      }
      return null;
    }else{
      if(numberOfPages > 1){
        if(_.size(req.query) > 0){
          return url + "&page=2";
        }
        return url + "?page=2";
      }
      return null;
    }
  }
  return null;
};

exports.getPreviousPageUrl = function(req, numberOfPages){
  var url = "http://" + req.headers.host + req.url;
  var queries = "";
  if(numberOfPages > 1){
    var splitUrl = url.split("?");
    if(req.query.page){
      if(req.query.page > 1){
        for (var property in req.query) {
          if(property != "page"){
            queries += "&" + property + "=" + req.query[property];
          }
        }
        if(_.size(req.query) > 1){
          return splitUrl[0] + "?" + queries.substring(1) + "&page=" + (parseInt(req.query.page) - 1);
        }
        return splitUrl[0] + "?" + queries.substring(1) + "page=" + (parseInt(req.query.page) - 1);
      }
      return null;
    }
    return null;
  }
  return null;
};

exports.sortResponse = function(array, sortByObject){
  if(sortByObject){
    //Sort required
    if(sortByObject.sortType == "number"){
      //Sort numbers
      return _.sortBy(array, function(obj){ return parseInt(obj[sortByObject.sortBy], 10) });
    }
    //Sort strings
    return _.sortBy(array, sortByObject.sortBy);
  }
  //No sort required
  return array;
};

exports.paginateResponse = function(array){
  var pageSize = 10;
  var pages = _.groupBy(array, function(element, index){
    return Math.floor(index/pageSize);
  });
  return pages = _.toArray(pages);
};

exports.findWhere = function(list, properties){
  return _.findWhere(list, properties);
};

exports.sendResponse = function(req, res, list, response){
  res.sendData({
    method: req.method,
    headers: req.headers,
    url: req.url,
    list: list,
    body: response
  });
};