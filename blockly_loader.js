goog.provide('MyController');

goog.require('BlockFactory');
goog.require('BlocklyDevTools.Analytics');
goog.require('FactoryUtils');
goog.require('BlockLibraryController');
goog.require('BlockExporterController');
goog.require('goog.dom.classlist');
goog.require('goog.ui.PopupColorPicker');
goog.require('goog.ui.ColorPicker');

var myowntoolbox = '<xml id="toolbox" style="display: none"> <category name="Input / Output">         <block type="source"></block>         <block type="destination"></block>       </category>       <category name="Number Inputs">         <block type="numbers_time_of_op">           <field name="VALUE">0</field>         </block>         <block type="numbers_speed">           <field name="VALUE">0</field>         </block>         <block type="numbers_cycles">           <field name="VALUE">0</field>         </block>         <block type="numbers_wavelength">           <field name="VALUE">0</field>         </block>         <block type="numbers_sequence">           <field name="VALUE">0</field>         </block>         <block type="numbers_co2">           <field name="VALUE">0</field>         </block>         <block type="numbers_speed">           <field name="VALUE">0</field>         </block>       </category>       <category name="String Inputs">         <block type="strings_ladder">           <field name="TEXT"> --- </field>         </block>         <block type="strings_dest">           <field name="TEXT"> --- </field>         </block>         <block type="strings_scale">           <field name="TEXT"> --- </field>         </block>         <block type="strings_purification">           <field name="TEXT"> --- </field>         </block>         <block type="strings_mcc">           <field name="TEXT"> --- </field>         </block>       </category>       <category name="Dropdown Menus">         <block type="drop_action">           <field name="NAME">OPTIONNAME</field>         </block>         <block type="drop_measure">           <field name="NAME">OPTIONNAME</field>         </block>         <block type="drop_type">           <field name="NAME">OPTIONNAME</field>         </block>         <block type="drop_temp">           <field name="NAME">OPTIONNAME</field>           <field name="NUMBER">0</field>         </block>         <block type="drop_duration">           <field name="NUMBER">0</field>           <field name="NAME">OPTIONNAME</field>         </block>       </category>       <category name="Extra">         <block type="new_op">           <field name="NAME"> --- </field>         </block>         <block type="extra_settings">           <field name="NAME">TRUE</field>         </block>         <block type="extra_mix_check">           <field name="NAME">TRUE</field>         </block>       </category>     </xml>   ';
var options = { 
  toolbox : myowntoolbox, 
  collapse : true, 
  comments : true, 
  disable : true, 
  maxBlocks : Infinity, 
  trashcan : true, 
  horizontalLayout : false, 
  toolboxPosition : 'start',
  css : true, 
  media : 'https://blockly-demo.appspot.com/static/media/', 
  rtl : false, 
  scrollbars : true, 
  sounds : true, 
  oneBasedIndex : true
};

MyController.js_init = function() {
  document.getElementById('custom_button_load').onclick = MyController.translate;  
  document.getElementById('custom_button_view').onclick = BlockFactory.updatePreview;  
  BlockFactory.mainWorkspace = Blockly.inject('blocklyDiv',options);
  MyController.injectCode(JSON.stringify(code_init,null, 2), 'languageTA')
  window.alert("My JS loaded!")
}

MyController.injectCode = function(code, id) {
  var pre = document.getElementById(id);
  pre.textContent = code;
 // code = pre.textContent;
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

    //var code = MyController.getBlockDefinition(blockType, rootBlock, format);
    //TODO: Esta es la funcioón a cambiar, la generación de código ha de ser custom para mis bloques. WIP: la de arriba
    var code = FactoryUtils.getBlockDefinition(blockType, rootBlock, format, BlockFactory.mainWorkspace);

    MyController.injectCode(code, 'languageTA');
  }
  //Automaticamente cambiar la vista del bloque cuando se cargue en el bloque(?)
  BlockFactory.updatePreview();
};

MyController.getBlockDefinition = function(blockType, rootBlock, format) {
  blockType = FactoryUtils.cleanBlockType(blockType);
  switch (format) {
    case 'JSON':
      var code = MyController.formatJson_(blockType, rootBlock);
      break;
    case 'JavaScript':
      var code = "Java Script Code not yet implemented";
      break;
  }
  return code;
};

MyController.formatJson_ = function(blockType, rootBlock) {
  var JS = {};
  // Type is not used by Blockly, but may be used by a loader.
  JS.type = blockType;
  // Generate inputs.
  var message = [];
  var args = [];
  var contentsBlock = rootBlock.getChildren()[0]; //gets the first child (and only) the block has
  var lastInput = null;
  while (contentsBlock) { //While not null -> we have a block to work with
    if (!contentsBlock.disabled) {
      switch(contentsBlock.type) {
          case "new_op":
              //code block
              break;
          case n:
              //code block
              break;
          default:
              //code block
      }
      contentsBlock = contentsBlock.getChildren()[0]; //gets the first child (and only) the block has


      var fields = FactoryUtils.getFieldsJson_(
          contentsBlock.getInputTargetBlock('FIELDS'));
      for (var i = 0; i < fields.length; i++) {
        if (typeof fields[i] == 'string') {
          message.push(fields[i].replace(/%/g, '%%'));
        } else {
          args.push(fields[i]);
          message.push('%' + args.length);
        }
      }

      var input = {type: contentsBlock.type};
      // Dummy inputs don't have names.  Other inputs do.
      if (contentsBlock.type != 'input_dummy') {
        input.name = contentsBlock.getFieldValue('INPUTNAME');
      }
      var check = JSON.parse(
          FactoryUtils.getOptTypesFrom(contentsBlock, 'TYPE') || 'null');
      if (check) {
        input.check = check;
      }
      var align = contentsBlock.getFieldValue('ALIGN');
      if (align != 'LEFT') {
        input.align = align;
      }
      args.push(input);
      message.push('%' + args.length);
      lastInput = contentsBlock;
    }
    contentsBlock = contentsBlock.nextConnection &&
        contentsBlock.nextConnection.targetBlock();
  }
  // Remove last input if dummy and not empty.
  if (lastInput && lastInput.type == 'input_dummy') {
    var fields = lastInput.getInputTargetBlock('FIELDS');
    if (fields && FactoryUtils.getFieldsJson_(fields).join('').trim() != '') {
      var align = lastInput.getFieldValue('ALIGN');
      if (align != 'LEFT') {
        JS.lastDummyAlign0 = align;
      }
      args.pop();
      message.pop();
    }
  }
  JS.message0 = message.join(' ');
  if (args.length) {
    JS.args0 = args;
  }
  // Generate inline/external switch.
  if (rootBlock.getFieldValue('INLINE') == 'EXT') {
    JS.inputsInline = false;
  } else if (rootBlock.getFieldValue('INLINE') == 'INT') {
    JS.inputsInline = true;
  }
  // Generate output, or next/previous connections.
  switch (rootBlock.getFieldValue('CONNECTIONS')) {
    case 'LEFT':
      JS.output =
          JSON.parse(
              FactoryUtils.getOptTypesFrom(rootBlock, 'OUTPUTTYPE') || 'null');
      break;
    case 'BOTH':
      JS.previousStatement =
          JSON.parse(
              FactoryUtils.getOptTypesFrom(rootBlock, 'TOPTYPE') || 'null');
      JS.nextStatement =
          JSON.parse(
              FactoryUtils.getOptTypesFrom(rootBlock, 'BOTTOMTYPE') || 'null');
      break;
    case 'TOP':
      JS.previousStatement =
          JSON.parse(
              FactoryUtils.getOptTypesFrom(rootBlock, 'TOPTYPE') || 'null');
      break;
    case 'BOTTOM':
      JS.nextStatement =
          JSON.parse(
              FactoryUtils.getOptTypesFrom(rootBlock, 'BOTTOMTYPE') || 'null');
      break;
  }
  // Generate colour.
  /*
  var colourBlock = rootBlock.getInputTargetBlock('COLOUR');
  if (colourBlock && !colourBlock.disabled) {
    var hue = parseInt(colourBlock.getFieldValue('HUE'), 10);
    JS.colour = hue;
  }*/

  //JS.tooltip = FactoryUtils.getTooltipFromRootBlock_(rootBlock);
  //JS.helpUrl = FactoryUtils.getHelpUrlFromRootBlock_(rootBlock);
  JS.colour = rootBlock.getHue();

  return JSON.stringify(JS, null, '  ');
};

var code_init = {
  "type": "block_type",
  "message0": "Operación: Thermocycling %1 Container Input %2 Variable: velocidad %3 %4 Variable: tiempo %5 %6 Variable: RPM %7",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    },
    {
      "type": "field_number",
      "name": "NAME",
      "value": 0
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_number",
      "name": "NAME",
      "value": 0
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_number",
      "name": "NAME",
      "value": 0
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "hELLO",
  "helpUrl": ""
};
