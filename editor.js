//To remove elements by value, not position
Array.prototype.remove_by_v = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var STARTER_BLOCK_XML_TEXT = '<xml><block type="new_op" ' +
    'deletable="false" movable="false"></block></xml>';

var MyController = {
};

var defined_blocks; // = Object.keys(Blockly.Blocks); // Blocks that are loaded at the beggining, before any new custom block loads

MyController.js_init = function() {
  window.alert('Init started')
  defined_blocks = Object.keys(Blockly.Blocks); // Blocks that are loaded at the beggining, before any new custom block loads
  document.getElementById('custom_button_load').onclick = MyController.translate;  
  document.getElementById('custom_button_view').onclick = MyController.updatePreview; 
  document.getElementById('custom_saveblock').onclick = MyController.saveBlock;  
  document.getElementById('custom_deleteblock').onclick = MyController.deleteBlock;  
  BlockFactory.mainWorkspace = Blockly.inject('editblockDiv',options);
  BlockFactory.otherWorkspace = Blockly.inject('bioblocksDiv',bboptions);
  BlockFactory.mainWorkspace.addChangeListener(MyController.translate);
  MyController.injectCode(JSON.stringify(code_init,null, 2), 'languageTA'); //"premade" code to be displayed
  MyController.updatePreview();
  MyController.showStarterBlock();
  window.alert("My JS loaded!");
};

function js_init2(){
  this.js_init();
  //window.alert("My JS loaded!");
};

MyController.showStarterBlock = function() {
  BlockFactory.mainWorkspace.clear();
  var xml = Blockly.Xml.textToDom(STARTER_BLOCK_XML_TEXT);
  Blockly.Xml.domToWorkspace(xml, BlockFactory.mainWorkspace);
};

MyController.deleteBlock = function() {
  let to_be_deleted = prompt("What block that you created do you want to delete?");
  if (defined_blocks.includes(to_be_deleted)){
    //Block has the name of a breviously defined block
    window.alert('The name of the block is a reserved one. Please only choose one of your custom blocks.');
    return;
  } else {
    if (custom_blocks.includes(to_be_deleted)){
      window.alert(to_be_deleted + ' will be deleted.');
      custom_blocks.remove_by_v(to_be_deleted);
      MyController.updateToolbox();
      return;
    } else {
    window.alert(to_be_deleted + ' is not the name of a custom block, please check it and try again.');
    return; }
  }
}

MyController.saveBlock = function() {
  var rootBlock = MyController.getNewOpBlock(BlockFactory.mainWorkspace);
  if (!rootBlock) {
    return;
  }
  block_name = rootBlock.getFieldValue('NAME');
  window.alert('the block will be saved as: ' + block_name)
  if (defined_blocks.includes(block_name)){
    //Block has the name of a breviously defined block
    window.alert('The name of the block is a reserved value, please change it.');
    return;
  } else {
    var current_blocks = Object.keys(Blockly.Blocks);
    var code = languageTA.value; //Works in the JS console
    if (custom_blocks.includes(block_name)){
      //window.alert('update block!');
      Blockly.Blocks[block_name] = {init:Blockly.jsonInitFactory_(JSON.parse(code))};
    } else {
      //window.alert('new block!');
      custom_blocks.push(block_name);
      Blockly.Blocks[block_name] = {init:Blockly.jsonInitFactory_(JSON.parse(code))};
    }
  }
  MyController.updateToolbox();
};

MyController.updateToolbox = function() {
  let iterator = 0;
  let custom_b_toolbox = '<sep></sep>' + '<category name="Custom Operations">';
  while(iterator<custom_blocks.length){
    custom_b_toolbox = custom_b_toolbox +  '<block type="'+custom_blocks[iterator]+'">' + '</block>' ;
    iterator = iterator + 1;
  }
  custom_b_toolbox = custom_b_toolbox+'</category>'
  var bioblockstoolbox = bioblocks_starting_toolbox + custom_b_toolbox;
  BlockFactory.otherWorkspace.updateToolbox(bioblockstoolbox);/*
  var bboptions = { 
    toolbox : bioblockstoolbox + '</xml>', 
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
  BlockFactory.otherWorkspace.dispose();
  BlockFactory.otherWorkspace = Blockly.inject('bioblocksDiv',bboptions);*/
};

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
  var message_i = 1;
  var block = rootBlock;//.getChildren()[0]; //gets the first child (and only) the block has
  while (block) { //While not null -> we have a block to work with
    var fields = [];
    if (!block.disabled/* && !block.getInheritedDisabled()*/) {
      switch (block.type) {
        //WIP BLOCKS:
        case 'field_dropdown':
          var options = [];
          for (var i = 0; i < block.optionList_.length; i++) {
            options[i] = [block.getUserData(i),
                block.getFieldValue('CPU' + i)];
          }
          if (options.length) {
            fields.push({
              type: block.type,
              name: block.getFieldValue('FIELDNAME'),
              options: options
            });
          }
          break;
          //VARS:
        case 'numbers_var':    
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
        case 'string_var':  
          fields.push({
            type: "field_input",//block.type,
            name: "NAME",
            text: block.getFieldValue("TEXT")
          });
          break;
        case 'check_var':
          fields.push({
            type: "field_checkbox",//block.type,
            name: "CHECK",
            checked: true
          });
          break;
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
          fields.push({
            type: "field_checkbox",//block.type,
            name: "check",
            checked: true
          });
          break;
        //case 'extra_settings': //Temporally disabled
        case 'new_op': //It does jack shit
          break;
        case 'default':
          window.alert("There has been an error parsing a block: Block not defined!")
          break;
      } //Cierre de Switch
    // - Comprobaciones según el tipo de bloque de lo que haya que insertar en el cuerpo del bloque:
    //New Operation special text
      if (block.type == "new_op"){ 
        message.push(block.getFieldValue() + ' ' + block.getFieldValue('NAME') + ' %' + message_i);
        message_i = message_i+1;
        args.push({
        "type": "input_dummy",
        "align": "CENTRE"
        });
        block_name = block.getFieldValue('NAME');
      } //Blocks that have a "null" value on it's body
      else if (block.type == "check_var"|| block.type == "string_var" || block.type == "numbers_var" || block.type == "field_dropdown" || block.type == "drop_action" ){
        message.push((block.getFieldValue('NAME')||block.getFieldValue('FIELDNAME')) + ' %' + message_i);
        message_i = message_i+1;
        args.push(fields[0]);
        args.push({
        "type": "input_dummy"
        });
        message.push('%' + message_i);
        message_i = message_i+1;
      } //Blocks that have to go to the right and have a notch
      else if (block.type == "source" || block.type == "destination"){
        message.push(block.getFieldValue() + ' %' + message_i);
        message_i = message_i+1;
        args.push({
        "type": "input_value",
        "name": "NAME",
        "align": "RIGHT"
        });
      } //Blocks that have 2 fields to be pushed
      else if (block.type == "drop_temp" ||  block.type == "drop_duration" ){
        message.push((block.getFieldValue()||"") + ' %' + message_i + ' %' + (message_i+1));
        message_i = message_i+2;
        args.push(fields[0]);
        args.push(fields[1]);
        args.push({
        "type": "input_dummy"
        });
        message.push('%' + message_i);
        message_i = message_i+1;
      } //Normal Blocks
      else { 
        message.push(block.getFieldValue() + ' %' + message_i);
        message_i = message_i+1;
        args.push(fields[0]);
        args.push({
        "type": "input_dummy"
        });
        message.push('%' + message_i);
        message_i = message_i+1;
      }//Cierre de IF-ELSE
    }//Cierre de IF
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
         scrollbars: false});
    BlockFactory.oldDir = newDir;
  }
  BlockFactory.previewWorkspace.clear();

  var format = 'JSON';//BlockFactory.getBlockDefinitionFormat();
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

var bioblocks_starting_toolbox = '<xml id="toolbox" style="display: none">   ' +
    '<category name="Organization">' +
      '<block type="experiment"></block>' +
      '<block type="step"></block>' +
    '</category>' +
    '<category name="Containers">' +
      '<block type="container"></block>' +
      '<block type="containerList"></block>' +
    '</category>' +
    '<category name="Operations">' +
      '<!--<block type="turbidostat"></block>-->' +
        '<block type="pipette"></block>' +
      '<block type="electrophoresis"></block>' +
      '<block type="incubate"></block>' +
      '<block type="centrifugation"></block>' +
      '<block type="thermocycling"></block>' +
      '<block type="measurement"></block>' +
      '<block type="sangerSequencing"></block>' +
      '<block type="oligosynthesize"></block>' +
      '<block type="colonyPicking"></block>' +
      '<block type="cellSpreading"></block>' +
      '<block type="flashFreeze"></block>' +
      '<block type="mix"></block>' +
      '<block type="flowCitometry"></block>' +
    '</category>' +
      '<category name="Logic">' +
      '<block type="controls_if"></block>' +
      '<block type="logic_compare"></block>' +
      '<block type="logic_operation"></block>' +
      '<block type="logic_negate"></block>' +
      '<block type="logic_boolean"></block>' +
      '<block type="logic_null"></block>' +
      '<block type="logic_ternary"></block>' +
    '</category>' +
    '<category name="Loops">' +
      '<block type="controls_repeat_ext">' +
        '<value name="TIMES">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="controls_whileUntil"></block>' +
      '<block type="controls_for">' +
        '<value name="FROM">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<value name="TO">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
        '<value name="BY">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="controls_forEach"></block>' +
      '<block type="controls_flow_statements"></block>' +
    '</category>' +
    '<category name="Math">' +
      '<block type="math_number"></block>' +
      '<block type="math_arithmetic"></block>' +
      '<block type="math_single"></block>' +
      '<block type="math_trig"></block>' +
      '<block type="math_constant"></block>' +
      '<block type="math_number_property"></block>' +
      '<block type="math_change">' +
        '<value name="DELTA">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="math_round"></block>' +
      '<block type="math_on_list"></block>' +
      '<block type="math_modulo"></block>' +
      '<block type="math_constrain">' +
        '<value name="LOW">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<value name="HIGH">' +
          '<block type="math_number">' +
            '<field name="NUM">100</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="math_random_int">' +
        '<value name="FROM">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<value name="TO">' +
          '<block type="math_number">' +
            '<field name="NUM">100</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="math_random_float"></block>' +
    '</category>' +
    '<category name="Variables" custom="VARIABLE"></category>' +
    '<category name="Functions" custom="PROCEDURE"></category>' /*+
  '</xml>' // REMOVED SO WE CAN APPEND ON IT THE NEW CATEGORIES*/;

var starting_toolbox = '<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;">' +
  '<category name="Input / Output">' +
    '<block type="source"></block>' +
    '<block type="destination"></block>' +
  '</category>' +
  '<category name="Number Inputs">' +
    '<block type="numbers_var">' +
      '<field name="NAME">Variable</field>' +
      '<field name="VALUE">0</field>' +
    '</block>' +
    '<block type="numbers_time_of_op">' +
      '<field name="VALUE">0</field>' +
    '</block>' +
    '<block type="numbers_speed">' +
      '<field name="VALUE">0</field>' +
    '</block>' +
    '<block type="numbers_cycles">' +
      '<field name="VALUE">0</field>' +
    '</block>' +
    '<block type="numbers_wavelength">' +
      '<field name="VALUE">0</field>' +
    '</block>' +
    '<block type="numbers_sequence">' +
      '<field name="VALUE">0</field>' +
    '</block>' +
    '<block type="numbers_co2">' +
      '<field name="VALUE">0</field>' +
    '</block>' +
  '</category>' +
  '<category name="String Inputs">' +
    '<block type="string_var">' +
      '<field name="NAME">Variable</field>' +
      '<field name="TEXT"> --- </field>' +
    '</block>' +
    '<block type="strings_ladder">' +
      '<field name="TEXT"> --- </field>' +
    '</block>' +
    '<block type="strings_dest">' +
      '<field name="TEXT"> --- </field>' +
    '</block>' +
    '<block type="strings_scale">' +
      '<field name="TEXT"> --- </field>' +
    '</block>' +
    '<block type="strings_purification">' +
      '<field name="TEXT"> --- </field>' +
    '</block>' +
    '<block type="strings_mcc">' +
      '<field name="TEXT"> --- </field>' +
    '</block>' +
  '</category>' +
  '<category name="Dropdown Menus">' +
    '<block type="field_dropdown">' +
      '<field name="NAME">OPTIONNAME</field>' +
    '</block>' +
    '<block type="drop_action">' +
      '<field name="NAME">OPTIONNAME</field>' +
    '</block>' +
    '<block type="drop_measure">' +
      '<field name="NAME">OPTIONNAME</field>' +
    '</block>' +
    '<block type="drop_type">' +
      '<field name="NAME">OPTIONNAME</field>' +
    '</block>' +
    '<block type="drop_temp">' +
      '<field name="NAME">OPTIONNAME</field>' +
      '<field name="NUMBER">0</field>' +
    '</block>' +
    '<block type="drop_duration">' +
      '<field name="NUMBER">0</field>' +
      '<field name="NAME">OPTIONNAME</field>' +
    '</block>' +
  '</category>' +
  '<category name="Extra">' +
    '<block type="check_var">' +
      '<field name="NAME">Variable</field>' +
    '</block>' +
    '<block type="extra_mix_check">' +
      '<field name="NAME">TRUE</field>' +
    '</block>' +
  '</category>' /*+
  '</xml>' // REMOVED SO WE CAN APPEND ON IT THE NEW CATEGORIES*/;

var editortoolbox = starting_toolbox;

var bioblockstoolbox = bioblocks_starting_toolbox;

var options = { 
  toolbox : editortoolbox + '</xml>', 
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

var bboptions = { 
  toolbox : bioblockstoolbox+'</xml>', 
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

var block_name = 'block_type';

var custom_blocks = Object.keys([]); //It will be the custom block that the logged user has created (Will have to be retrieved by a GET call to MongoDB)

//var defined_blocks = Object.keys(Blockly.Blocks); // Blocks that are loaded at the beggining, before any new custom block loads

