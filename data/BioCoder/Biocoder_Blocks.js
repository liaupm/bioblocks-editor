
Blockly.defineBlocksWithJsonArray([{
  "type": "new_fluid",
  "message0": "Fluid: %1 %2 Volume: %3 %4 Unit: %5",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "name"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
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
      "type": "field_dropdown",
      "name": "NAME",
      "options": [
        [
          "mL",
          "OPTIONNAME"
        ],
        [
          "L",
          "OPTIONNAME"
        ],
        [
          "uL",
          "OPTIONNAME"
        ]
      ]
    }
  ],
  "output": "fluid",
  "colour": 220,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "new_solid",
  "message0": "Solid: %1 %2 Volume: %3 %4 Temperature: %5",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "name"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
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
  "output": "solid",
  "colour": 220,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "new_containter",
  "message0": "Containter: %1 %2 Volume: %3 %4 Type: %5",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "name"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "field_input",
      "name": "NAME",
      "text": "0"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_dropdown",
      "name": "NAME",
      "options": [
        [
          "STERILE_MICROFUGE_TUBE",
          "OPTIONNAME"
        ],
        [
          "CENTRIFUGE_TUBE_15ML",
          "OPTIONNAME"
        ],
        [
          "FLASK",
          "OPTIONNAME"
        ],
        [
          "CENTRIFUGE_BOTTLE",
          "OPTIONNAME"
        ],
        [
          "GRADUATED_CYLINDER",
          "OPTIONNAME"
        ],
        [
          "RXN_TUBE",
          "OPTIONNAME"
        ],
        [
          "FRESH_COLL_TUBE",
          "OPTIONNAME"
        ],
        [
          "LIQUID_NITROGEN",
          "OPTIONNAME"
        ],
        [
          "PLG",
          "OPTIONNAME"
        ],
        [
          "OAKRIDGE",
          "OPTIONNAME"
        ],
        [
          "QIA_CARTRIDGE",
          "OPTIONNAME"
        ],
        [
          "CUVETTE_ICE",
          "OPTIONNAME"
        ],
        [
          "SPEC_CUVETTE",
          "OPTIONNAME"
        ],
        [
          "STOCK_PLATE_96",
          "OPTIONNAME"
        ],
        [
          "WELL_BLOCK_96",
          "OPTIONNAME"
        ],
        [
          "PCR_PLATE",
          "OPTIONNAME"
        ],
        [
          "LIQUID_BLOCK",
          "OPTIONNAME"
        ],
        [
          "CELL_CULT_CHAMBER",
          "OPTIONNAME"
        ],
        [
          "EPPENDORF",
          "OPTIONNAME"
        ],
        [
          "STERILE_MICROFUGE_TUBE2ML",
          "OPTIONNAME"
        ],
        [
          "STERILE_PCR_TUBE",
          "OPTIONNAME"
        ],
        [
          "CENTRI_TUBE_50ML",
          "OPTIONNAME"
        ],
        [
          "CRYO_VIAL",
          "OPTIONNAME"
        ],
        [
          "SCREW_CAP_TUBE",
          "OPTIONNAME"
        ]
      ]
    }
  ],
  "output": "container",
  "colour": 219,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "new_plate",
  "message0": "Plate: %1 %2 State: %3",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "name"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "field_input",
      "name": "NAME",
      "text": "     "
    }
  ],
  "output": "solid",
  "colour": 220,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "measure_fluids",
  "message0": "Measure Fluids %1 Volume: %2 %3 Fluid/Container 1 %4 Fluid/Container 2 %5",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
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
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "measure_solid",
  "message0": "Measure Solid %1 Weigh: %2 %3 Unit: %4 %5 Solid: %6",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
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
      "type": "field_dropdown",
      "name": "NAME",
      "options": [
        [
          "mg",
          "OPTIONNAME"
        ],
        [
          "g",
          "OPTIONNAME"
        ],
        [
          "kg",
          "OPTIONNAME"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "measure_props",
  "message0": "Measure Props %1 Volume: %2 %3 Container 1 %4 Fluid/Container 2 %5",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
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
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "plate_out",
  "message0": "Plate out %1 Volume: %2 %3 Plate %4 Container %5",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
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
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "transfer",
  "message0": "Transfer %1 Container 1 %2 Container 2 %3",
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
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "combine",
  "message0": "Combine %1 Container 1 %2 Container 2 %3",
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
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "dissolve",
  "message0": "Dissolve %1 Container %2",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "resuspend",
  "message0": "Resuspend %1 Container %2",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "incubate_and_mix",
  "message0": "Incubate and Mix %1 Container %2 Temperature of Incubation: %3 %4 Time of Incubation: %5 %6 Time of Mix: %7 %8 Type of mix: %9",
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
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_dropdown",
      "name": "NAME",
      "options": [
        [
          "STIRRING",
          "OPTIONNAME"
        ],
        [
          "INVERTING",
          "OPTIONNAME"
        ],
        [
          "VORTEXING",
          "OPTIONNAME"
        ]
      ]
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "mixing_table",
  "message0": "Mixing Table %1 Container %2 Number of Columns %3 %4 Number of Rows %5 %6 Volumes (array) %7 Fluids (array) %8",
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
      "type": "input_value",
      "name": "NAME",
      "check": "Array",
      "align": "RIGHT"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "check": "Array",
      "align": "RIGHT"
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "incubate1",
  "message0": "Incubate %1 Container %2 Temperature %3 %4 Time %5 %6 RPM %7",
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
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "inoculation",
  "message0": "Inoculation %1 Container %2 Fluid/Solid %3 Temperature %4 %5 Cell Density %6 %7 Time %8 %9 Volume %10 %11",
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
      "type": "field_dropdown",
      "name": "NAME2",
      "options": [
        [
          "mL",
          "OPTIONNAME"
        ],
        [
          "L",
          "OPTIONNAME"
        ],
        [
          "uL",
          "OPTIONNAME"
        ]
      ]
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "dry_pellet",
  "message0": "Dry Pellet %1 Container %2 Time %3 %4 Time %5",
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
      "type": "field_dropdown",
      "name": "NAME",
      "options": [
        [
          "IN_AIR",
          "OPTIONNAME"
        ],
        [
          "IN_VACUUM",
          "OPTIONNAME"
        ]
      ]
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "facs",
  "message0": "Facs %1 Container %2",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "sequencing",
  "message0": "Secuencing %1 Container %2",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "electroporate",
  "message0": "Electroporate %1 Container %2 Voltage %3 %4 Number of Pulses %5",
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
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "weigh",
  "message0": "Weigh %1 Container %2",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "cell_culture",
  "message0": "Cell Culture %1 Container (cells) %2 Medium %3 Centrifugation Speed %4 %5 Temperature %6 %7 Time %8 %9 CO2%% %10 %11 Other Fluids %12",
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
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_number",
      "name": "NAME",
      "value": 0,
      "min": 0,
      "max": 100
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "transfection",
  "message0": "Transfection %1 Container %2 Medium %3 DNA %4",
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
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    },
    {
      "type": "input_value",
      "name": "NAME",
      "align": "RIGHT"
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
}]);