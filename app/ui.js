/*
  ui.js
  
  tiene que manejar todos los handlers y crear todos los elementos/componentes
  del sistema operativo 

  */

var gui = window.require("nw.gui");
var p5manager = require('./p5manager.js');
var win = gui.Window.get();

var focus_ctx;
var focus_win;
var current_editor;

/*
  setupUi()

  Se llama desde el app.js para configurar las cosas nativas de la UI.

 */

exports.setupUi = function() {
    clipboardFix(); // Add cliboard functionalities.
    p5manager.newProject(); // Create an initial project.
    win.hide(); // Hide the debug window
    //win.close(); // Close debug window
}

/*
  setupHandlers()

  Esta función se llama desde afuera para setear los handlers de una ventana.

 */


exports.setupHandlers = function(window, win, editor, ctx) {

    var $ = ctx.window.$;
    focus_win = ctx.window.win;
    focus_ctx = ctx;

    /*
      UI Nodes
     */

    $button_run = $(".button_run");
    $button_open = $(".button_open");
    $button_exit = $(".exit_button");
    $button_new = $(".button_new");
    $button_chrome_dev_tool = $(".button_chrome_dev_tool");

    /*
      UI Handlers (Algunos se resuelven aca y otros en p5manager)
     */

    $button_exit.click(function() {
        actions_quit();
    });

    $button_open.click(function() {
        actions_open($);
    });

    $button_run.click(function() {
        actions_run();
    });

    $button_chrome_dev_tool.click(function() {
        actions_devTool();
    });

    $button_new.click(function() {
        p5manager.newProject();
    })

}


/*
  setSidebar()
  
  Se encarga de crear la barra del costado en base a la información que tenemos
  del proyecto actual. Es llamado desde el project.js correspondiente.

 */

exports.setSidebar = function() {
    var $ = focus_ctx.window.$;
    //Main File
    $(".sidebarFiles").append("<li class='mainFile active'>" + focus_ctx.project.mainFile.name + ".pde</li>");

    //Secondary Files
    if (focus_ctx.project.secondaryFiles) {
        for (var i = 0; i < focus_ctx.project.secondaryFiles.length; i++) {
            $(".sidebarFiles").append("<li class='secondaryFile'>" + focus_ctx.project.secondaryFiles[i].name + "</li>");
        }
    }

}


/*
  setFocusedWin()

  Se llama cada vez que el project esta en focus.

 */


exports.setFocusedWin = function(ctx, win) {
    focus_ctx = ctx;
    focus_win = win;
}


/*
  clipboardFix()

  Fix the clipboard issue in Mac.

 */

function clipboardFix() {
    var menu;
    menu = new gui.Menu({
        type: "menubar"
    });
    try {
        menu.createMacBuiltin("Codepoems", {
            hideWindow: true
        });
        win.menu = menu;
    } catch (ex) {}
}


/*
  Actions
  
  Here starts the actions.

 */


/*
  actions_open()

  Usa el input oculto para abrir el trigger 

 */


function actions_open($) {
    // Activa el File Dialog escondido en el project.html
    $("#fileDialog").trigger("click");

    // Captura el evento en el que se selecciona el archivo.
    $("#fileDialog").change(function(evt) {
        // Guarda el path absoluto del archivo.
        var file_path = $(this).val();
        // Manda el path a p5manager que se encarga de validarlo y de abrir un nuevo project.
        p5manager.openProject(file_path);
        // Reseteamos el valor del fileDialog para evitar conflictos al abrir dos veces lo mismo.
        $(this).val("");
    });

};



/*
  actions_quit()
  
  Cierra todas las ventanas abiertas.

 */

function actions_quit() {
    focus_win.close();
}



/*
  actions_run()

  Ejecuta el proyecto en focus.

 */

function actions_run() {

}


/*
  actions_stop()

  Detiene el proyecto en focus.

 */

function actions_stop() {

}


/*
  actions_devTool()

  Abre la Chrome Developer Tool para el contexto en foco.

 */

function actions_devTool() {
    focus_win.showDevTools();
}