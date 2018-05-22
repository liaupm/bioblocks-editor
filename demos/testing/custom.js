goog.provide('MyController');

goog.require('BlockFactory');
goog.require('BlocklyDevTools.Analytics');
goog.require('FactoryUtils');
goog.require('BlockLibraryController');
goog.require('BlockExporterController');
goog.require('goog.dom.classlist');
goog.require('goog.ui.PopupColorPicker');
goog.require('goog.ui.ColorPicker');

function js_init() {
  //document.getElementById('blocklyDiv').addEventListener('change', BlockFactory.updateLanguage);
  //document.getElementById('languageTA').addEventListener('change', BlockFactory.updatePreview);
  document.getElementById('custom_button_load').onclick = MyController.translate;  
  document.getElementById('custom_button_view').onclick = BlockFactory.updatePreview;  
  /*document.getElementById('languageTA')
      .addEventListener('change', BlockFactory.manualEdit);
  document.getElementById('languageTA')
      .addEventListener('keyup', BlockFactory.manualEdit);*/
  var toolbox = document.getElementById('toolbox');
  BlockFactory.mainWorkspace = Blockly.inject('blocklyDiv',
      {collapse: false,
       toolbox: toolbox,
       media: '../../media/'});
  window.alert("My JS loaded!")
}

MyController.injectCode = function(code, id) {
  var pre = document.getElementById(id);
  pre.textContent = code;
  code = pre.textContent;
 // code = PR.prettyPrintOne(code, 'js');
  pre.innerHTML = code;
};
//Funcion para obtener el bloque de creación de operaciones
MyController.getNewOpBlock = function(workspace) {
  var blocks = workspace.getTopBlocks(false);
  for (var i = 0, block; block = blocks[i]; i++) {
    if (block.type == 'new_op') {
      return block;
    }
  }
  return null;
};

//funcion usada para traducir los bloques del workspace en código
MyController.translate = function() {
//function translate() {
	// rootBlock = new_op block
  var rootBlock = MyController.getNewOpBlock(BlockFactory.mainWorkspace);
  if (!rootBlock) {
    return;
  }
  var blockType = rootBlock.getFieldValue('NAME').trim().toLowerCase();
  if (!blockType) {
    blockType = BlockFactory.UNNAMED;
  }

  if (!BlockFactory.updateBlocksFlag) {
    var format = document.getElementById('format').value;
    if (format == 'Manual-JSON') {
      format = 'JSON';
    } else if (format == 'Manual-JS') {
      format = 'JavaScript';
    }

    var code = FactoryUtils.getBlockDefinition(blockType, rootBlock, format,
        BlockFactory.mainWorkspace);

    MyController.injectCode(code, 'languageTA');
    /*if (!BlockFactory.updateBlocksFlagDelayed) {
      var languagePre = document.getElementById('languagePre');
      var languageTA = document.getElementById('languageTA');
      code = languagePre.textContent.trim();
      languageTA.value = code;
    }*/
  }

  BlockFactory.updatePreview();
};
