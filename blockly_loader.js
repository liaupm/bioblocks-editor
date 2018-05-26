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
  document.getElementById('custom_button_view').onclick = MyController.updatePreview;  
  BlockFactory.mainWorkspace = Blockly.inject('blocklyDiv',options);
  MyController.injectCode(JSON.stringify(code_init,null, 2), 'languageTA')
  MyController.updatePreview();
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

    var code = MyController.getBlockDefinition(blockType, rootBlock, format);
    //TODO: Esta es la funcioón a cambiar, la generación de código ha de ser custom para mis bloques. WIP: la de arriba
    //var code = FactoryUtils.getBlockDefinition(blockType, rootBlock, format, BlockFactory.mainWorkspace);

    MyController.injectCode(code, 'languageTA');
  }
  //Automaticamente cambiar la vista del bloque cuando se cargue en el bloque(?)
  MyController.updatePreview();
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
  var i = 1;
  var block = rootBlock;//.getChildren()[0]; //gets the first child (and only) the block has
  while (block) { //While not null -> we have a block to work with
    var fields = [];
    if (!block.disabled/* && !block.getInheritedDisabled()*/) {
      switch (block.type) {
        // NUMBER BLOCKS
        case 'numbers_time_of_op':
        case 'numbers_speed':
        case 'numbers_cycles':
        case 'numbers_wavelength':
        case 'numbers_sequence':
        case 'numbers_co2':
        case 'numbers_speed':
          var obj = {
            type: "field_number",//block.type,
            name: "NAME",
            value: parseFloat(block.getFieldValue('VALUE'))
          };
            obj.min = 0;
            //obj.max = Infinity;
            //obj.precision = 0;
          fields.push(obj);
          break;
        // STRING BLOCKS
        case 'strings_ladder':
        case 'strings_dest':
        case 'strings_scale':
        case 'strings_purification':
        case 'strings_mcc':
          fields.push({
            type: "field_input",//block.type,
            name: "NAME",
            text: block.getFieldValue("TEXT")
          });
          break;
        // DROPDOWN BLOCKS
        case 'drop_measure':
          var options = [
            [
              "Abrorbance",
              "OPTIONNAME"
            ],
            [
              "Fluorescence",
              "OPTIONNAME"
            ],
            [
              "Luminiscence",
              "OPTIONNAME"
            ],
            [
              "Volume",
              "OPTIONNAME"
            ],
            [
              "Temperature",
              "OPTIONNAME"
            ]
          ];
          fields.push({
            type: "field_dropdown",//block.type,
            name: "dropdown",
            options: options
          });
          break;
        case 'drop_action':
          var options = [
            [
              "Transfer",
              "OPTIONNAME"
            ],
            [
              "Distribute",
              "OPTIONNAME"
            ],
            [
              "Consolidate",
              "OPTIONNAME"
            ],
            [
              "Continuous Transfer",
              "OPTIONNAME"
            ]
          ];
          fields.push({
            type: "field_dropdown",//block.type,
            name: "dropdown",
            options: options
          });
          break;
        case 'drop_type':
          var options = [
            [
              "Vortex",
              "OPTIONNAME"
            ],
            [
              "Shake",
              "OPTIONNAME"
            ]            
          ];
          fields.push({
            type: "field_dropdown",//"field_dropdown",//block.type,
            name: "dropdown",
            options: options
          });
          break;
        case 'drop_temp':
          var options = [
          [
            "Celsius",
            "OPTIONNAME"
          ],
          [
            "Kelvin",
            "OPTIONNAME"
          ]
          ];
          fields.push({
            type: "field_dropdown",//block.type,
            name: "dropdown",
            options: options
          });
          var obj = {
            type: "field_number",//block.type,
            name: "NAME",
            value: parseFloat(block.getFieldValue('NUMBER'))
          };
          fields.push(obj);
          break;
        case 'drop_duration':
          var obj = {
            type: "field_number",//block.type,
            name: "NAME",
            value: parseFloat(block.getFieldValue('NUMBER'))
          };
          fields.push(obj);
          var options = [
            [
              "Milliseconds",
              "OPTIONNAME"
            ],
            [
              "Seconds",
              "OPTIONNAME"
            ],
            [
              "Minutes",
              "OPTIONNAME"
            ],
            [
              "Hours",
              "OPTIONNAME"
            ]
          ];
          fields.push({
            type: "field_dropdown",//block.type,
            name: "dropdown",
            options: options
          });
          break;
        case 'extra_mix_check':

        //case 'extra_settings': //Temporally disabled
        case 'new_op': //It does jack shit
          fields.push({
            type: "field_checkbox",//block.type,
            name: "check",
            checked: true
          });
          break;
        case 'default':
          window.alert("There has been an error parsing a block: Block not defined!")
          break;
      } //Cierre de Switch
    } //Cierre de IF
    
    if (block.type == "new_op"){
      message.push(block.getFieldValue() + ' ' + block.getFieldValue('NAME') + ' %' + i);
      i = i+1;
      args.push({
      "type": "input_dummy",
      "align": "CENTRE"
      });
    } else if (block.type == "source" || block.type == "destination"){
      message.push(block.getFieldValue() + ' %' + i);
      i = i+1;
      //args.push(fields[0]);
      args.push({
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
      });
      //message.push('%' + i);
      //i = i+1;
    } else if (block.type == "drop_temp" ||  block.type == "drop_duration"){
      message.push(block.getFieldValue() + ' %' + i + ' %' + (i+1));
      i = i+2;
      args.push(fields[0]);
      args.push(fields[1]);
      args.push({
      "type": "input_dummy"
      });
      message.push('%' + i);
      i = i+1;
    } else {
      message.push(block.getFieldValue() + ' %' + i);
      i = i+1;
      args.push(fields[0]);
      args.push({
      "type": "input_dummy"
      });
      message.push('%' + i);
      i = i+1;
    }
    //block = block.nextConnection && block.nextConnection.targetBlock(); doesn't seem to work, so instead we use:
    block = block.getChildren()[0]; //gets the first child (and only) the block has
  }//Cierre del while
  
    //contentsBlock = contentsBlock.nextConnection && contentsBlock.nextConnection.targetBlock();
  //}
  // Remove last input if dummy and not empty.
  /*
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
  }*/
  JS.message0 = message.join(' ');
  if (args.length) {
    JS.args0 = args;
  }
  // Generate external switch.
  JS.inputsInline = false;
  // Generate output, or next/previous connections. Will always be BOTH:
  //switch (rootBlock.getFieldValue('CONNECTIONS')) {case 'BOTH':
  JS.previousStatement =
      JSON.parse(
          FactoryUtils.getOptTypesFrom(rootBlock, 'TOPTYPE') || 'null');
  JS.nextStatement =
      JSON.parse(
          FactoryUtils.getOptTypesFrom(rootBlock, 'BOTTOMTYPE') || 'null');
    //break;}
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

MyController.getFieldsJson_ = function(block) {
  var fields = [];
  while (block) {
    if (!block.disabled && !block.getInheritedDisabled()) {
      switch (block.type) {
        // NUMBER BLOCKS
        case 'numbers_time_of_op':
        case 'numbers_speed':
        case 'numbers_cycles':
        case 'numbers_wavelength':
        case 'numbers_sequence':
        case 'numbers_co2':
        case 'numbers_speed':
          var obj = {
            type: block.type,
            name: block.getFieldValue('FIELDNAME'),
            value: parseFloat(block.getFieldValue('VALUE'))
          };
            obj.min = 0;
            obj.max = Infinity;
            obj.precision = 0;
          fields.push(obj);
          break;
        // STRING BLOCKS
        case 'strings_ladder':
        case 'strings_dest':
        case 'strings_scale':
        case 'strings_purification':
        case 'strings_mcc':
          fields.push({
            type: block.type,
            name: "NAME",
            text: block.getFieldValue()
          });
          break;
        // DROPDOWN BLOCKS
        case 'drop_measure':
          var options = [
            [
              "Abrorbance",
              "OPTIONNAME"
            ],
            [
              "Fluorescence",
              "OPTIONNAME"
            ],
            [
              "Luminiscence",
              "OPTIONNAME"
            ],
            [
              "Volume",
              "OPTIONNAME"
            ],
            [
              "Temperature",
              "OPTIONNAME"
            ]
          ];
          fields.push({
            type: block.type,
            name: "dropdown",
            options: options
          });
          break;
        case 'drop_action':
          var options = [
            [
              "Transfer",
              "OPTIONNAME"
            ],
            [
              "Distribute",
              "OPTIONNAME"
            ],
            [
              "Consolidate",
              "OPTIONNAME"
            ],
            [
              "Continuous Transfer",
              "OPTIONNAME"
            ]
          ];
          fields.push({
            type: block.type,
            name: "dropdown",
            options: options
          });
          break;
        case 'drop_type':
          var options = [
            [
              "Vortex",
              "OPTIONNAME"
            ],
            [
              "Shake",
              "OPTIONNAME"
            ]            
          ];
          fields.push({
            type: block.type,
            name: "dropdown",
            options: options
          });
          break;
        case 'drop_temp':
          var options = [
          [
            "Celsius",
            "OPTIONNAME"
          ],
          [
            "Kelvin",
            "OPTIONNAME"
          ]
          ];
          fields.push({
            type: block.type,
            name: "dropdown",
            options: options
          });
          break;
        case 'drop_duration':
          var options = [
            [
              "Milliseconds",
              "OPTIONNAME"
            ],
            [
              "Seconds",
              "OPTIONNAME"
            ],
            [
              "Minutes",
              "OPTIONNAME"
            ],
            [
              "Hours",
              "OPTIONNAME"
            ]
          ];
          fields.push({
            type: block.type,
            name: "dropdown",
            options: options
          });
          break;
        case 'extra_settings':
        case 'extra_mix_check':
        case 'default':
          window.alert("There has been an error parsing a block: Block not defined!")
          break;
      }
    }
    block = block.nextConnection && block.nextConnection.targetBlock();
  }
  return fields;
};


MyController.updatePreview = function() {
  // Toggle between LTR/RTL if needed (also used in first display).
  var newDir = document.getElementById('direction').value;
  if (BlockFactory.oldDir != newDir) {
    if (BlockFactory.previewWorkspace) {
      BlockFactory.previewWorkspace.dispose();
    }
    var rtl = newDir == 'rtl';
    BlockFactory.previewWorkspace = Blockly.inject('preview',
        {rtl: rtl,
         media : 'https://blockly-demo.appspot.com/static/media/', 
         scrollbars: true});
    BlockFactory.oldDir = newDir;
  }
  BlockFactory.previewWorkspace.clear();

  var format = BlockFactory.getBlockDefinitionFormat();
  var code = document.getElementById('languageTA').value;
  if (!code.trim()) {
    // Nothing to render.  Happens while cloud storage is loading.
    return;
  }

  // Backup Blockly.Blocks object so that main workspace and preview don't
  // collide if user creates a 'factory_base' block, for instance.
  var backupBlocks = Blockly.Blocks;
  try {
    // Make a shallow copy.
    Blockly.Blocks = Object.create(null);
    for (var prop in backupBlocks) {
      Blockly.Blocks[prop] = backupBlocks[prop];
    }

    if (format == 'JSON') {
      var json = JSON.parse(code);
      Blockly.Blocks[json.type || BlockFactory.UNNAMED] = {
        init: function() {
          this.jsonInit(json);
        }
      };
    } else if (format == 'JavaScript') {
      try {
        eval(code);
      } catch (e) {
        // TODO: Display error in the UI
        console.error("Error while evaluating JavaScript formatted block definition", e);
        return;
      }
    }

    // Look for a block on Blockly.Blocks that does not match the backup.
    var blockType = null;
    for (var type in Blockly.Blocks) {
      if (typeof Blockly.Blocks[type].init == 'function' &&
          Blockly.Blocks[type] != backupBlocks[type]) {
        blockType = type;
        break;
      }
    }
    if (!blockType) {
      return;
    }

    // Create the preview block.
    var previewBlock = BlockFactory.previewWorkspace.newBlock(blockType);
    previewBlock.initSvg();
    previewBlock.render();
    previewBlock.setMovable(false);
    previewBlock.setDeletable(false);
    previewBlock.moveBy(15, 10);
    BlockFactory.previewWorkspace.clearUndo();
    //MyController.updateGenerator(previewBlock);

    // Warn user only if their block type is already exists in Blockly's
    // standard library.
    var rootBlock = FactoryUtils.getRootBlock(BlockFactory.mainWorkspace);
    if (rootBlock){
          if (blockType == 'block_type') {
      // Warn user to let them know they can't save a block under the default
      // name 'block_type'
      rootBlock.setWarningText('You cannot save a block with the default ' +
          'name, "block_type"');

    } else {
      rootBlock.setWarningText(null);
    }
    }

  } catch(err) {
    // TODO: Show error on the UI
    console.log(err);
    BlockFactory.updateBlocksFlag = false
    BlockFactory.updateBlocksFlagDelayed = false
  } finally {
    Blockly.Blocks = backupBlocks;
  }
};

MyController.updateGenerator = function(block) {
  var language = document.getElementById('language').value;
  var generatorStub = FactoryUtils.getGeneratorStub(block, language);
  MyController.injectCode(generatorStub, 'generatorPre');
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
