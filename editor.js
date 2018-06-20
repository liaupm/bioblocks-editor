/*
For the correct functionallity of this code you need: 
 - The Blockly main files (blockly_compressed.js, blocks_compressed.js, msg/js/en.js)
 - Some files from the 'blockfactory' demo (blocks.js, factory.js & factory_utils.js)
 - The Bioblock's blocks files (this is for having them show up in the toolbox)
*/
/* --------------------------------------------------------- External Code ------------------------------------------------------ */


/*
To remove elements by value, not position. Source:
https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value 
*/
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

/* 
To handle file download. Source: 
https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
*/
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/* +
To make some of the scripts work (specially in bitbloq), I have added some of Google's Blockfactory script functions to my own code
This funcitions have been copied from the blockly repository and have been added unmodified. 
Some of the functions in the rest of the code also come from there, however, if they aren't in this section, they have been modified for the editor's use.
*/
var FactoryUtils = {
};

FactoryUtils.getRootBlock = function(workspace) {
  var blocks = workspace.getTopBlocks(false);
  for (var i = 0, block; block = blocks[i]; i++) {
    if (block.type == 'factory_base') {
      return block;
    }
  }
  return null;
};

FactoryUtils.cleanBlockType = function(blockType) {
  if (!blockType) {
    return '';
  }
  return blockType.replace(/\W/g, '_').replace(/^(\d)/, '_$1');
};

FactoryUtils.getOptTypesFrom = function(block, name) {
  var types = FactoryUtils.getTypesFrom_(block, name);
  if (types.length == 0) {
    return undefined;
  } else if (types.indexOf('null') != -1) {
    return 'null';
  } else if (types.length == 1) {
    return types[0];
  } else {
    return '[' + types.join(', ') + ']';
  }
};

FactoryUtils.getTypesFrom_ = function(block, name) {
  var typeBlock = block.getInputTargetBlock(name);
  var types;
  if (!typeBlock || typeBlock.disabled) {
    types = [];
  } else if (typeBlock.type == 'type_other') {
    types = [JSON.stringify(typeBlock.getFieldValue('TYPE'))];
  } else if (typeBlock.type == 'type_group') {
    types = [];
    for (var n = 0; n < typeBlock.typeCount_; n++) {
      types = types.concat(FactoryUtils.getTypesFrom_(typeBlock, 'TYPE' + n));
    }
    // Remove duplicates.
    var hash = Object.create(null);
    for (var n = types.length - 1; n >= 0; n--) {
      if (hash[types[n]]) {
        types.splice(n, 1);
      }
      hash[types[n]] = true;
    }
  } else {
    types = [JSON.stringify(typeBlock.valueType)];
  }
  return types;
};

FactoryUtils.getGeneratorStub = function(block, generatorLanguage) {
  // Build factory blocks from block
  if (BlockFactory.updateBlocksFlag) {  // TODO: Move this to updatePreview()
    BlockFactory.mainWorkspace.clear();
    var xml = BlockDefinitionExtractor.buildBlockFactoryWorkspace(block);
    Blockly.Xml.domToWorkspace(xml, BlockFactory.mainWorkspace);
    // Calculate timer to avoid infinite update loops
    // TODO(#1267): Remove the global variables and any infinite loops.
    BlockFactory.updateBlocksFlag = false;
    setTimeout(
        function() {BlockFactory.updateBlocksFlagDelayed = false;}, 3000);
  }
  BlockFactory.lastUpdatedBlock = block; // Variable to share the block value.

  function makeVar(root, name) {
    name = name.toLowerCase().replace(/\W/g, '_');
    return '  var ' + root + '_' + name;
  }
  // The makevar function lives in the original update generator.
  var language = generatorLanguage;
  var code = [];
  code.push("Blockly." + language + "['" + block.type +
            "'] = function(block) {");

  // Generate getters for any fields or inputs.
  for (var i = 0, input; input = block.inputList[i]; i++) {
    for (var j = 0, field; field = input.fieldRow[j]; j++) {
      var name = field.name;
      if (!name) {
        continue;
      }
      if (field instanceof Blockly.FieldVariable) {
        // Subclass of Blockly.FieldDropdown, must test first.
        code.push(makeVar('variable', name) +
                  " = Blockly." + language +
                  ".variableDB_.getName(block.getFieldValue('" + name +
                  "'), Blockly.Variables.NAME_TYPE);");
      } else if (field instanceof Blockly.FieldAngle) {
        // Subclass of Blockly.FieldTextInput, must test first.
        code.push(makeVar('angle', name) +
                  " = block.getFieldValue('" + name + "');");
      } else if (Blockly.FieldDate && field instanceof Blockly.FieldDate) {
        // Blockly.FieldDate may not be compiled into Blockly.
        code.push(makeVar('date', name) +
                  " = block.getFieldValue('" + name + "');");
      } else if (field instanceof Blockly.FieldColour) {
        code.push(makeVar('colour', name) +
                  " = block.getFieldValue('" + name + "');");
      } else if (field instanceof Blockly.FieldCheckbox) {
        code.push(makeVar('checkbox', name) +
                  " = block.getFieldValue('" + name + "') == 'TRUE';");
      } else if (field instanceof Blockly.FieldDropdown) {
        code.push(makeVar('dropdown', name) +
                  " = block.getFieldValue('" + name + "');");
      } else if (field instanceof Blockly.FieldNumber) {
        code.push(makeVar('number', name) +
                  " = block.getFieldValue('" + name + "');");
      } else if (field instanceof Blockly.FieldTextInput) {
        code.push(makeVar('text', name) +
                  " = block.getFieldValue('" + name + "');");
      }
    }
    var name = input.name;
    if (name) {
      if (input.type == Blockly.INPUT_VALUE) {
        code.push(makeVar('value', name) +
                  " = Blockly." + language + ".valueToCode(block, '" + name +
                  "', Blockly." + language + ".ORDER_ATOMIC);");
      } else if (input.type == Blockly.NEXT_STATEMENT) {
        code.push(makeVar('statements', name) +
                  " = Blockly." + language + ".statementToCode(block, '" +
                  name + "');");
      }
    }
  }
  // Most languages end lines with a semicolon.  Python does not.
  var lineEnd = {
    'JavaScript': ';',
    'Python': '',
    'PHP': ';',
    'Dart': ';'
  };
  code.push("  // TODO: Assemble " + language + " into code variable.");
  if (block.outputConnection) {
    code.push("  var code = '...';");
    code.push("  // TODO: Change ORDER_NONE to the correct strength.");
    code.push("  return [code, Blockly." + language + ".ORDER_NONE];");
  } else {
    code.push("  var code = '..." + (lineEnd[language] || '') + "\\n';");
    code.push("  return code;");
  }
  code.push("};");

  return code.join('\n');
};


/*
From this point onwards, all the code has been written by @Buhorl, altough some of the funcions may be based on ones Blockly has.
*/
/* ---------------------------------------------------------- Main Code ------------------------------------------------------- */


// Namespace of the editor. All of the functions created by @Buhorl are declared inside
var MyController = {
};

// Initial function. Used to load the editor to make it usable
MyController.js_init = function() {
  console.log('Init started...') //This a
  //Blocks that are loaded at the beggining, before any new custom block loads
  defined_blocks = Object.keys(Blockly.Blocks); 
  //Button declarations
  document.getElementById('custom_button_load').onclick = MyController.translate;  
  document.getElementById('custom_button_view').onclick = MyController.updatePreview; 
  document.getElementById('custom_saveblock').onclick = MyController.saveBlock;  
  document.getElementById('custom_deleteblock').onclick = MyController.deleteBlock;
  document.getElementById('custom_downloadblock').onclick = MyController.downloadblock;  
  document.getElementById('custom_downloadblocks').onclick = MyController.downloadblocks;  
  //Injections of the 3 workspaces: editor, preview of the block and bioblock preview
  BlockFactory.mainWorkspace = Blockly.inject('editblockDiv',options);
  BlockFactory.otherWorkspace = Blockly.inject('blocklyDivExperiment',bboptions);
  BlockFactory.mainWorkspace.addChangeListener(MyController.translate); //this is for the automatic changes in the preview
  MyController.injectCode(JSON.stringify(code_init,null, 2), 'languageTA'); //"premade" code to be displayed. Gets overwritten if loads correctly
  MyController.updatePreview(); 
  MyController.showStarterBlock();
  console.log('Init has finished');
};

//Function used to load the "new_op" block
MyController.showStarterBlock = function() {
  BlockFactory.mainWorkspace.clear();
  var xml = Blockly.Xml.textToDom(STARTER_BLOCK_XML_TEXT);
  Blockly.Xml.domToWorkspace(xml, BlockFactory.mainWorkspace);
  BlockFactory.mainWorkspace.blockDB_[Object.keys(BlockFactory.mainWorkspace.blockDB_)[0]].moveBy(5,0)
};

//Wonky way to call the function to download only one block
MyController.downloadblock = function(){
  MyController.download('block');  
}

//Same but for all the defined blocks
MyController.downloadblocks = function(){
  MyController.download('all');
}

//This function is used to prepare the text to download. Uses a function i found on the internet to handle the file download
MyController.download = function(name){
    // Generate download with the XML to load the toolbox
    let comment;
    comment = '<!--This file is the XML used to define toolbox for the custom block(s)-->\n\n';
    var rootBlock = MyController.getNewOpBlock(BlockFactory.mainWorkspace);
    var text = '<block type="'+ rootBlock.getFieldValue('NAME') +'">' + '</block>';
    var filename = "block_toolbox.xml";
    if (name=='all'){
      let iterator = 0;
      let custom_b_toolbox = '<sep></sep>\n' + '<category name="Custom Operations">\n';
      while(iterator<custom_blocks.length){
        custom_b_toolbox = custom_b_toolbox +  '<block type="'+custom_blocks[iterator]+'">' + '</block>\n' ;
        iterator = iterator + 1;
      }
      custom_b_toolbox = custom_b_toolbox+'</category>'
      text = custom_b_toolbox;
      filename = "all_blocks_toolbox.xml"
    } 
    download(filename, comment + text);
    // Generate download with the JSON code of the blocks
    comment = '//This file contains the JSON that defines this block. You have to add it to Blockly/BioBlock manually. \n';
    text = document.getElementById('languageTA').value;
    filename = "block.json";
    if (name=='all'){
      iterator = 0;
      text = "Blockly.defineBlocksWithJsonArray([\n"
      while(iterator<custom_blocks.length-1){
        comment = '//This file contains the function to declare all the BioBlocks\n\n';
        text = text + custom_blocks_code[custom_blocks[iterator]] + ',\n';
        iterator = iterator + 1;
      }
      text = text + custom_blocks_code[custom_blocks[iterator]] + '\n]);';
      filename = "all_blocks.js"
    }
    download(filename, comment + text);
}

//Function to delete the block from the BioBlock workspace
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
      MyController.updateToolbox(); //Changes to the bioblock workspace apply here
      return;
    } else {
    window.alert(to_be_deleted + ' is not the name of a custom block, please check it and try again.');
    return; }
  }
}

//Function to save the block to the BioBlock workspace
MyController.saveBlock = function() {
  var rootBlock = MyController.getNewOpBlock(BlockFactory.mainWorkspace);
  if (!rootBlock) {
    return; //Legacy check. Now we sould always get the correct block unless a problen occurs
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
      custom_blocks_code[block_name] = code;
      Blockly.Blocks[block_name] = {init:Blockly.jsonInitFactory_(JSON.parse(code))};
    } else {
      //window.alert('new block!');
      custom_blocks_code[block_name] = code;
      custom_blocks.push(block_name);
      Blockly.Blocks[block_name] = {init:Blockly.jsonInitFactory_(JSON.parse(code))};
    }
  }
  MyController.updateToolbox(); //Changes to the bioblock workspace apply here
};

//Apply the changes to the custom bioblocks to the workspace.
MyController.updateToolbox = function() {
  let iterator = 0;
  //We create the XML code of all the custom blocks
  let custom_b_toolbox = '<sep></sep>' + '<category name="Custom Operations">';
  while(iterator<custom_blocks.length){
    custom_b_toolbox = custom_b_toolbox +  '<block type="'+custom_blocks[iterator]+'">' + '</block>' ;
    iterator = iterator + 1;
  }
  custom_b_toolbox = custom_b_toolbox+'</category>'
  var bioblockstoolbox = bioblocks_starting_toolbox + custom_b_toolbox;
  // and we append the new toolbox to the "old" one. 
  //We use and embed Blockly function. This is because otherwise it would be too complicated
  BlockFactory.otherWorkspace.updateToolbox(bioblockstoolbox); 
};

MyController.injectCode = function(code, id) {
  var pre = document.getElementById(id);
  pre.textContent = code;
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

/*
Function to translate the editor blocks into code and send it where it belongs.
If we want to add new blocks to the editor, we have to go to formatJson_ wich is the one that does the real translation 
*/
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
    MyController.injectCode(code, 'languageTA');
  }
  //Automatically changes the view when the block is loaded.
  MyController.updatePreview();
};

//Gets the format of the code. Right now only JSON is implemented (it's simpler to use, and we only need that one for now) 
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

/*
Biggest & most important function in the entire file
ESP: Si se quiere añadir nuevos bloques al editor, es aquí donde hay que meterlos para que se traten según lo que se quiera que hagan.
ENG: If we want to add new block to the editor, here is where we have to add them so they do what they should.
*/
MyController.formatJson_ = function(blockType, rootBlock) {
  var JS = {};
  // Type is not used by Blockly, but may be used by a loader.
  JS.type = blockType;
  // Generate inputs.
  var message = [];
  var args = [];
  var message_i = 1;
  var block = rootBlock; //we start going through all the blocks, starting by the root (new_op)
  while (block) { //While not null --> we have a block to work with
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
        case 'new_op': 
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
    block = block.getChildren()[0]; //gets the first child (and only) the block has -> Problem if the editor blocks have >1 child (example: right side notches)
  }//Cierre del while
  
  JS.message0 = message.join(' ');
  if (args.length) {
    JS.args0 = args;
  }
  // Generate external switch.
  JS.inputsInline = false;
  // Generate output, or next/previous connections. Will always be BOTH:
  JS.previousStatement =
      JSON.parse(
          FactoryUtils.getOptTypesFrom(rootBlock, 'TOPTYPE') || 'null');
  JS.nextStatement =
      JSON.parse(
          FactoryUtils.getOptTypesFrom(rootBlock, 'BOTTOMTYPE') || 'null');
  // Generate colour.
  /*
  var colourBlock = rootBlock.getInputTargetBlock('COLOUR');
  if (colourBlock && !colourBlock.disabled) {
    var hue = parseInt(colourBlock.getFieldValue('HUE'), 10);
    JS.colour = hue;
  }*/
  // Generate tooltips/url for the block
  //JS.tooltip = FactoryUtils.getTooltipFromRootBlock_(rootBlock);
  //JS.helpUrl = FactoryUtils.getHelpUrlFromRootBlock_(rootBlock);
  JS.colour = rootBlock.getHue(); //The block colour get's inherited from the root block 

  return JSON.stringify(JS, null, '  ');
};

// Reloading the preview workspace 
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
    // Nothing to render. Happens while cloud storage is loading.
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
    previewBlock.render(); // important, so the block svg resizes correctly
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

      /* ------------ Editor Variables ------------ */

// Example of a block to load at the beggining. It gets replaced fast if the editor loads correctly so it's barely visible
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

// First toolbox for the BioBlock editor
var bioblocks_starting_toolbox = '<xml id="toolbox" style="display: none">   ' +
    '<category name="Organization" colour="#222222">' +
      '<block type="experiment"></block>' +
      '<block type="step"></block>' +
    '</category>' +
    '<category name="Containers" colour="#5d79a6">' +
      '<block type="container"></block>' +
      '<block type="containerList"></block>' +
    '</category>' +
    '<category name="Operations" colour="#3AB157">' +
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
    '<sep></sep>' +
      '<category name="Logic" colour="#999999">' +
      '<block type="controls_if"></block>' +
      '<block type="logic_compare"></block>' +
      '<block type="logic_operation"></block>' +
      '<block type="logic_negate"></block>' +
      '<block type="logic_boolean"></block>' +
      '<block type="logic_null"></block>' +
      '<block type="logic_ternary"></block>' +
    '</category>' +
    '<category name="Loops" colour="#999999">' +
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
    '<category name="Math" colour="#999999">' +
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
    '<category name="Variables" custom="VARIABLE" colour="#999999"></category>' +
    '<category name="Functions" custom="PROCEDURE" colour="#999999"></category>' /*+
  '</xml>' // REMOVED SO WE CAN APPEND ON IT THE NEW CATEGORIES*/
  //Added the BioCoder Blocks
  + '<sep></sep>' + //'<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;">' +
'<category name="Declaration &amp; Mixing" colour="#a55b5b">' +
'<block type="new_fluid">' +
'<field name="NAME">Name</field>' +
'<field name="NAME">0</field>' +
'<field name="NAME">Name</field>' +
'</block>' +
'<block type="new_solid">' +
'<field name="NAME">Name</field>' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'</block>' +
'<block type="new_containter">' +
'<field name="NAME">Name</field>' +
'<field name="NAME">0</field>' +
'<field name="NAME">Name</field>' +
'</block>' +
'<block type="new_plate">' +
'<field name="NAME">Name</field>' +
'<field name="NAME">     </field>' +
'</block>' +
'</category>' +
'<category name="Measurements" colour="#a5935b">' +
'<block type="measure_fluids">' +
'<field name="NAME">0</field>' +
'</block>' +
'<block type="measure_solid">' +
'<field name="NAME">0</field>' +
'<field name="NAME">Name</field>' +
'</block>' +
'<block type="measure_props">' +
'<field name="NAME">0</field>' +
'</block>' +
'<block type="plate_out">' +
'<field name="NAME">0</field>' +
'</block>' +
'<block type="transfer"></block>' +
'</category>' +
'<category name="Combination and Mixing" colour="#80a55b">' +
'<block type="combine"></block>' +
'<block type="dissolve"></block>' +
'<block type="resuspend"></block>' +
'<block type="incubate_and_mix">' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'<field name="NAME">Name</field>' +
'</block>' +
'<block type="mixing_table">' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'</block>' +
'</category>' +
'<category name="Temperature and Storage" colour="#5ba580">' +
'<block type="incubate1">' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'</block>' +
'<block type="inoculation">' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'<field name="NAME2">Name</field>' +
'</block>' +
'<block type="dry_pellet">' +
'<field name="NAME">0</field>' +
'<field name="NAME">Name</field>' +
'</block>' +
'</category>' +
'<category name="Detection and Analysis" colour="#5b93a5">' +
'<block type="facs"></block>' +
'<block type="sequencing"></block>' +
'<block type="electroporate">' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'</block>' +
'<block type="weigh"></block>' +
'<block type="cell_culture">' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'<field name="NAME">0</field>' +
'</block>' +
'<block type="transfection"></block>' +
'</category>';

// The editor Toolbox. Add/Modify here if you want to change what blocks appear on the editor
var starting_toolbox = '<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;">' +
  '<category name="Input / Output" colour="#A29857">' +
    '<block type="source"></block>' +
    '<block type="destination"></block>' +
  '</category>' +
  '<category name="Number Inputs" colour="#A77358">' +
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
  '<category name="String Inputs" colour="#4CA7A5">' +
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
  '<category name="Dropdown Menus" colour="#6457A6">' +
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
  '<category name="Extra" colour="#B038A5">' +
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

//Options for the editor
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

//Options for the bioblocks workspace
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

// Blocks that are loaded at the beggining, before any new custom block loads
var defined_blocks; // = Object.keys(Blockly.Blocks); 

// var that contains the "new_op" block that is used in the editor
var STARTER_BLOCK_XML_TEXT = '<xml><block type="new_op" ' +
    'deletable="false" movable="false"></block></xml>';

//Initial given na,e of the starter block. Gets changed
var block_name = 'block_type';

var custom_blocks = Object.keys([]); //It will be the custom block that the logged user has created (Will have to be retrieved by a GET call to MongoDB)

var custom_blocks_code = Object.keys([]); //To store the block's code to be able to later download them

//var defined_blocks = Object.keys(Blockly.Blocks); // Blocks that are loaded at the beggining, before any new custom block loads

