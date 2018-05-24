goog.provide('MyController');

goog.require('BlockFactory');
goog.require('BlocklyDevTools.Analytics');
goog.require('FactoryUtils');
goog.require('BlockLibraryController');
goog.require('BlockExporterController');
goog.require('goog.dom.classlist');
goog.require('goog.ui.PopupColorPicker');
goog.require('goog.ui.ColorPicker');

var myowntoolbox = '<xml id="toolbox" style="display: none"><category name="Input / Output"><block type="source"></block>        <block type="destination"></block>      </category>      <category name="Number Inputs">        <block type="numbers_time_of_op">          <field name="VALUE">0</field>        </block>        <block type="numbers_speed">          <field name="VALUE">0</field>        </block>        <block type="numbers_cycles">          <field name="VALUE">0</field>        </block>        <block type="numbers_wavelength">          <field name="VALUE">0</field>        </block>        <block type="numbers_sequence">          <field name="VALUE">0</field>        </block>        <block type="numbers_co2">          <field name="VALUE">0</field>        </block>        <block type="numbers_speed">          <field name="VALUE">0</field>        </block>      </category>      <category name="String Inputs">        <block type="strings_ladder">          <field name="TEXT"> --- </field>        </block>        <block type="strings_dest">          <field name="TEXT"> --- </field>        </block>        <block type="strings_scale">          <field name="TEXT"> --- </field>        </block>        <block type="strings_purification">          <field name="TEXT"> --- </field>        </block>        <block type="strings_mcc">          <field name="TEXT"> --- </field>        </block>      </category>      <category name="Dropdown Menus">        <block type="drop_action">          <field name="NAME">OPTIONNAME</field>        </block>        <block type="drop_measure">          <field name="NAME">OPTIONNAME</field>        </block>        <block type="drop_type">          <field name="NAME">OPTIONNAME</field>        </block>        <block type="drop_temp">          <field name="NAME">OPTIONNAME</field>          <field name="NUMBER">0</field>        </block>        <block type="drop_duration">          <field name="NUMBER">0</field>          <field name="NAME">OPTIONNAME</field>        </block>      </category>      <category name="Extra">        <block type="new_op">          <field name="NAME"> --- </field>        </block>        <block type="new_op2">          <field name="NAME"> --- </field>        </block>        <block type="extra_settings">          <field name="NAME">TRUE</field>        </block>        <block type="extra_mix_check">          <field name="NAME">TRUE</field>        </block>      </category>    </xml>   ';
MyController.js_init = function() {
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
       toolbox: myowntoolbox,
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
