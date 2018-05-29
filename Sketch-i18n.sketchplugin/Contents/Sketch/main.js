@import 'translate.js'
@import 'generate.js'
@import 'utils.js'

var onGenerate = function(context){
	var currentDocument = context.document;
    if (currentDocument == null) {
        alert("Generate","You need to save your document first!");
        return;
    } else {
    	var translationFileURL = [[[currentDocument fileURL] URLByDeletingPathExtension] URLByAppendingPathExtension:@"json"];
    	if(isExistFilePath([translationFileURL path])){
    		var alertDialog = [[NSAlert alloc] init];
			[alertDialog addButtonWithTitle:"OK"];
			[alertDialog addButtonWithTitle:"Cancel"];
			[alertDialog setMessageText:"Replace current file?"];
			[alertDialog setAlertStyle:NSWarningAlertStyle];
			if ([alertDialog runModal] == NSAlertFirstButtonReturn) {
				generateLanguageFile(currentDocument);
			}
    	} else {
    		generateLanguageFile(currentDocument);
    	}
    
    }
}
var onTranslate = function(context) {
    var currentDocument = context.document;
    if (currentDocument == null) {
        alert("Translate","You need to save your document first!");
        return;
    } else {
        var translationFileURL = [[[currentDocument fileURL] URLByDeletingPathExtension] URLByAppendingPathExtension:@"json"];
        
        // 获取文件的绝对路劲
        var translationFileURLString = [translationFileURL absoluteString]
        var translationFileURLArray = [translationFileURLString componentsSeparatedByString:@"/"]
        var fileName = [translationFileURLArray objectAtIndex: [translationFileURLArray count] - 1]
    
        // 替换字符串
        var configFileUrlString = [translationFileURLString stringByReplacingOccurrencesOfString:fileName withString:@"config.json"];
        var configFileUrl = [[NSURL alloc] initWithString:configFileUrlString]

        // 先判断是否存在预先放置的json文件
        if(isExistFilePath([configFileUrl path])) {
            log('------')
            translateFile(context,[configFileUrl path]);
        } else if(isExistFilePath([translationFileURL path])){
            translateFile(context,[translationFileURL path]);
        } else {
            alert("Translate","Not found language file!");
        }
    }
}
