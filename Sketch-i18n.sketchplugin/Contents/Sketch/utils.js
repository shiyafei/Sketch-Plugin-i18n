function alert(title, message) {
  var app = [NSApplication sharedApplication];
  [app displayDialog: message withTitle: title];
}

function isTextLayer(layer) {
  if (layer.class() === MSTextLayer) {
    return true;
  }

  return false;
}

function isSymbolInstanceLayer(layer) {
  if (layer.class() === MSSymbolInstance) {
    return true
  }
  return false
}

function isNeedTranslate(layer) {
  var layerName = layer.name();

  return true;
}


function isExistFilePath(filePath) {
  var fileManager = [NSFileManager defaultManager];
  return [fileManager fileExistsAtPath: filePath];
}

function getTextLayersOfPage(pages) {
  var layers = [pages children];
  var textLayers = [];
  var symbolLayers = [];
  var layerMap = {};
  for (var i = 0; i < layers.count(); i++) {
    var layer = [layers objectAtIndex: i];
    if (isTextLayer(layer) && isNeedTranslate(layer)) {
      textLayers.push(layer);
    } else if (isSymbolInstanceLayer(layer)) {
      symbolLayers.push(layer)
    }
  }
  return { textLayers: textLayers, symbolLayers: symbolLayers };
}
