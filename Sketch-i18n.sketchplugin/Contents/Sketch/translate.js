@import 'utils.js'

function translateFile(context, filePath){
	var currentString = NSString.stringWithContentsOfFile_encoding_error(filePath, NSUTF8StringEncoding, null);
	var currentJsonObject = JSON.parse(currentString.toString());
	var keys = currentJsonObject["keys"];

    var comboBoxContainer = [[NSView alloc] initWithFrame:NSMakeRect(0,0,200,25)];
    var comboxBox = [[NSComboBox alloc] initWithFrame:NSMakeRect(0,0,200,25)];
    [comboxBox addItemsWithObjectValues:keys];
    [comboxBox selectItemAtIndex:0];
    [comboBoxContainer addSubview:comboxBox];

    var languageDialog = [[NSAlert alloc] init];
    [languageDialog setMessageText:"Select language to translate"];
    [languageDialog addButtonWithTitle:'OK']
    [languageDialog addButtonWithTitle:'Cancel']
    [languageDialog setAccessoryView:comboBoxContainer]

    if ([languageDialog runModal] == NSAlertFirstButtonReturn) {
		var keyIndex = [comboxBox indexOfSelectedItem];
        var currentPage = context.document.currentPage();
        var allPages = context.document.pages()
        for(var i = 0 ;i < allPages.length; i++) {
            translatePage(allPages[i],currentJsonObject,keys[keyIndex]);
        }
		alert("Translate","Completed!");
	}
}


function translatePage(page, jsonObject, languageKey){
    var layersMap = getTextLayersOfPage(page);
    var symbolLayers = layersMap['symbolLayers']
    var textLayers = layersMap['textLayers']
    for (var i = 0; i < textLayers.length; i++) {
        var textLayer = textLayers[i];
        var stringValue = unescape(textLayer.name());
        if(jsonObject[stringValue]){
            var localeObject = jsonObject[stringValue];
            if (languageKey in Object.keys(localeObject)) {
                textLayer.setStringValue(localeObject[languageKey]);
                [textLayer adjustFrameToFit];
            }
        }
    }
    var needOverrides = []
    var needValues = []
    // 过滤出需要转换字符串的symbol
    for (var i = 0; i < symbolLayers.length; i++) {
        var symbolLayer = symbolLayers[i];
        var overrides = [symbolLayer overrides]
        var overrideValues = [symbolLayer overrideValues]
        for (var j = 0; j < overrideValues.length; j++) {
            var value = overrideValues[j].value()
            var overrideName = overrideValues[j].overrideName()
            if (value.class() === __NSCFString && ![overrideName containsString:@"_symbolID"]) {
                needOverrides.push(overrideValues[j])
                needValues.push(unescape(value))
            }
        }
    }
    // 遍历配置文件，国际化
    log(JSON.stringify(needValues))
    for (var jkey in jsonObject) {
        for(subjkey in jsonObject[jkey]) {
            var index = needValues.indexOf(jsonObject[jkey][subjkey])
            if (index != -1 && languageKey in jsonObject[jkey]) {
                var m = jsonObject[jkey][languageKey]
                var value = [NSString stringWithString: m]
                needOverrides[index].value = value
            }
        }
    }
}