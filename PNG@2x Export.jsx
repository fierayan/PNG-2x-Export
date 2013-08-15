#target photoshop

app.bringToFront();  

function main(){

	var doc = app.activeDocument;
	var psdPath = app.activeDocument.path;
	var outFolderName="pngExport";

	var outFolder = new Folder(psdPath + "/"+outFolderName);
	if (!outFolder.exists) {
	    outFolder.create();
	}

	var lname = doc.activeLayer.name;
	saveLayer(doc.activeLayer, lname, psdPath, false);	

	function saveLayer(layer, lname, path, shouldMerge) {
	    dupLayers();
	    if (shouldMerge === undefined || shouldMerge === true) {
		activeDocument.mergeVisibleLayers();
	    }
	    activeDocument.trim(TrimType.TRANSPARENT,true,true,true,true);
		if(activeDocument.width % 2 != 0) {
        activeDocument.resizeCanvas(activeDocument.width + 1, activeDocument.height, AnchorPosition.MIDDLECENTER);
		}
		if(activeDocument.height % 2 != 0) {
        activeDocument.resizeCanvas(activeDocument.width, activeDocument.height+ 1, AnchorPosition.MIDDLECENTER);
		}
	    var saveFile= File(path +"/"+outFolderName+"/"+lname+"@2x.png");
		SavePNG(saveFile);		
		activeDocument.resizeImage(undefined,undefined, app.activeDocument.resolution / 2, ResampleMethod.BICUBICSHARPER);
		saveFile=File(path +"/"+outFolderName+"/"+lname+".png"); 
		SavePNG(saveFile);
	    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	}
}

main();

function dupLayers() { 
        var descac = new ActionDescriptor();
        var refac1 = new ActionReference();
        refac1.putClass( charIDToTypeID('Dcmn') );
	descac.putReference( charIDToTypeID('null'), refac1 );
        descac.putString( charIDToTypeID('Nm  '), activeDocument.activeLayer.name );
        var refac2 = new ActionReference();
        refac2.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
        descac.putReference( charIDToTypeID('Usng'), refac2 );
        executeAction( charIDToTypeID('Mk  '), descac, DialogModes.NO );
}

function SavePNG(saveFile){
    var pngOpts = new ExportOptionsSaveForWeb; 
    pngOpts.format = SaveDocumentType.PNG
    pngOpts.PNG8 = false; 
    pngOpts.transparency = true; 
    pngOpts.interlaced = false; 
    pngOpts.quality = 100;
    activeDocument.exportDocument(new File(saveFile),ExportType.SAVEFORWEB,pngOpts); 
	
}
