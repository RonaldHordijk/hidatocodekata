/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

Ext.setup({
  onReady: function() {
    'use strict';
    
    var
      viewport,     
      activepuzz = hidato.data[0];

    function resizeCanvas () {
      hidato.resize(Math.min(Ext.get('canvaspanel').getWidth(), window.innerWidth), 
                    Math.min(Ext.get('canvaspanel').getHeight(), window.innerHeight));   
    }
    
    viewport = Ext.create('Ext.Panel', {
        fullscreen: true,
        layout: 'card'
      });    

    viewport.isMainForm = function () {
      return viewport.getActiveItem() === viewport.mainPanel;     
    };
   

    var 
      resultButton = new Ext.Button({
        ui: 'button',
        text: 'New',
        handler: function() {
          viewport.setActiveItem(puzzleForm /*viewport.puzzlePanel*/, {type: 'slide', direction: 'left'});
        }
      });

    var 
      settingsButton = new Ext.Button({
        iconCls: 'settings',
        iconMask: true,
        handler: function() {
          viewport.setActiveItem(viewport.settingsPanel, {type: 'slide', direction: 'left'});
        }
      });
    
    var 
      mainToolbar = Ext.create('Ext.Toolbar', {
        dock: 'top',
        ui: 'light',
        title: 'Hidato',
        items: [resultButton, settingsButton]
      });   

    var 
      canvasPanel = Ext.create('Ext.Panel', {
        layout: 'fit',
        flex: 10,
        id: 'canvaspanel',
        style: "background-color: #FFF",
        listeners: {
          resize: function () {
            resizeCanvas();   
          }
       }   
    });

    viewport.mainPanel = Ext.create('Ext.Panel', {
      fullscreen: true,
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      items: [mainToolbar, canvasPanel],
      listeners: {
        show: function () {
          mainToolbar.setTitle('Hidato [' + activepuzz.name + '<img style = "height: 0.7em;" src="css/img/star_' + activepuzz.level +'.png"> ]');
        }  
      }
    });

    var 
      backButton = new Ext.Button({
        ui: 'back',
        text: 'Back',
        handler: function() {
          viewport.setActiveItem(viewport.mainPanel, {type: 'slide', direction: 'right'});
        }
    });

    var 
      unsortButton = new Ext.Button({
        text: 'Unsorted',
        align: 'right',
        handler: function() {
          puzzleStore.setSorters(["name"]).sort();
        }  
    });

    var 
      sortButton = new Ext.Button({
        text: 'sort',
        align: 'right',
        handler: function() {
          Ext.Viewport.add(sortPicker);
          sortPicker.show();          
        }  
    });
    
    var 
      sortPicker = Ext.create('Ext.Picker', {
            slots: [{
                name: 'sort',
                title: 'Sorting',
                data: [{
                    text: 'Order',
                    value: 0
                }, {
                    text: 'Size',
                    value: 1
                }, {
                    text: 'Difficulty',
                    value: 2
                }]
            }],
            listeners: {
                pick: function (picker, value) {
                  if (value.sort === 0) {
                    puzzleStore.setGrouper(function (item) {});
                    puzzleStore.setSorters(['name']).sort();
                  } else if (value.sort === 1) {
                    puzzleStore.setGrouper(function (item) {
                      return '(' + item.get('nCols') + 'x' + item.get('nRows') + ')';
                    });
                    puzzleStore.setSorters(['nCols', 'name']).setGroupDir('ASC').sort();
                  } else if (value.sort === 2) {
                    puzzleStore.setGrouper(function (item) {
                      return '<img style = "height: 2em;" src="css/img/star_' + item.get('level') + '.png">';
                    });
                    puzzleStore.setSorters(['level', 'name']).setGroupDir('DESC').sort();
                  }   
               }
            }    
        });    

    var 
      sizeButton = new Ext.Button({
        text: 'Size',
        align: 'right',
        handler: function() {
          puzzleStore.setSorters(["nCols", "name"]).sort();
        }  
    });

    var 
      levelButton = new Ext.Button({
        ui:  'normal',
        text: 'Difficulty',
        align: 'right',
        handler: function() {
          puzzleStore.setSorters(["level", "name"]).sort();
        }  
    });

    var backButton = new Ext.Button({
        ui: 'back',
        text: 'Back',
        handler: function() {
          viewport.setActiveItem(viewport.mainPanel, {type: 'slide', direction: 'right'});
        }
    });

    var 
      puzzleToolbar = new Ext.Toolbar({
        ui: 'light',
        title: 'Puzzles',
        dock: 'top',
        align: 'top',
        items: [backButton, unsortButton,  sizeButton, levelButton]
    });   
    
    var
      puzzleStore = Ext.create('Ext.data.Store', {
        sorters: 'name',        
        fields: ['name', 'level', 'nCols', 'nRows'],
        groupDir: 'ASC',
         grouper: {
           groupFn: function (item) {return ''} 
         },  
          // groupFn: function (item) {
            // return '<img style = "height: 2em;" src="css/img/star_' + item.get('level') + '.png">';
          // } // groupFn
        // },
        data: hidato.data, 
       });

    var 
      puzzleForm = Ext.create('Ext.List', {
        fullscreen: true,
        pinHeaders: true,
        grouped: true,
        store: puzzleStore,
        itemTpl: '<span style="width:15%; display:inline-block;">{name}</span><span style="width:25%; display:inline-block;">({nCols}x{(nRows})</span> <img style = "height: 1em;" src="css/img/star_{level}.png">',
        items: [{
            xtype: 'toolbar',
            docked: 'top',        
            ui: 'light',
            title: 'Puzzles',
            items: [backButton,  sortButton], 
        }],            
        listeners: {
            select: function (list, model) {
              activepuzz = model.raw;
              hidato.changepuzzle(activepuzz);
              viewport.setActiveItem(viewport.mainPanel, {type: 'slide', direction: 'right'});
            } // select
        } // listeners
      }); // create()

    // viewport.puzzlePanel = Ext.create('Ext.Panel', {
      // fullscreen: true,
// //      layout: 'vbox',
      // layout : 'fit',
      // items: [viewport.notesListToolbar]     
    // });

    var 
      backButton2 = new Ext.Button({
        ui: 'back',
        text: 'Back'
      });

    backButton2.addListener('tap', function () {
       
      viewport.setActiveItem(viewport.mainPanel, {type: 'slide', direction: 'right'});
    });       

    var 
      colorSchemeItems = [];
     
    Object.keys(hidato.drawingSchemes).forEach(function (key) {
      if (key === 'active') {
        return;
      }
      
      colorSchemeItems.push({
        xtype: 'radiofield',
        name: 'colorscheme',
        label: key,
        value: key,
        checked: hidato.drawingSchemes.active === hidato.drawingSchemes[key],
        listeners: {
          check: function (comp, e) {
            hidato.drawer.initialize(hidato.canvas, hidato.drawingSchemes[key], hidato.animationPool);
          }
        }  
      });
    }); 
     

    var 
      settingsform = Ext.create('Ext.Panel', {
       xtype: 'form',
        id: 'basicform',
        scroll: 'vertical',
        layout: 'vbox',
        dock: 'top',
        items: [{
          xtype: 'fieldset',
          title: 'Colour scheme',
          id: 'colorSchemeSelect',
          instructions: 'Please select a colour scheme.',
          defaults: {
            labelWidth: 180
          }, // defaults
          items: colorSchemeItems,
        }, {
            xtype: 'button',
            text: 'Clear history',
            handler: function () {
              Ext.Msg.confirm("Confirmation", "Are you sure you want to delete your history?", function () {});
            } 
        }]        
    });    

    var 
      settingsToolbar = new Ext.Toolbar({
        ui: 'light',
        title: 'Settings',
        items: [backButton2]
    });   

    viewport.settingsPanel = Ext.create('Ext.Panel', {
       fullscreen: true,
       layout: 'vbox',
       items: [settingsToolbar, settingsform]     
    });

    hidato.viewport = viewport;
    
    viewport.show();
    viewport.setActiveItem(viewport.mainPanel, {type: 'slide', direction: 'right'});

    hidato.setupCanvas(canvasPanel.getId(), Ext.get('canvaspanel').getWidth(), Ext.get('canvaspanel').getHeight());   

    function onBackButton(event) {
      if (!viewport.isMainForm()) {
        viewport.setActiveItem(viewport.mainPanel, {type: 'slide', direction: 'right'});
      } else {
        navigator.app.exitApp();
      } 
    }

    function onDeviceReady() {
      document.addEventListener("backbutton", onBackButton, false);
    }

    document.addEventListener("backbutton", onBackButton, false);
    document.addEventListener("deviceready", onDeviceReady, false);
    
  }
});
