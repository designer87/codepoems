/*
  > project.js

  Una instancia concreta de un proyecto. Se crea una por cada ventana que hay de codepoems. Entendemos
  como proyecto a el conjunto de archivos de processing que forman una aplicación

  El project.js se encarga de:

  * Refrescar el sidebar
  * Agregar un archivo al proyecto (agregarlo al sidebar y pushear el doc correspondiente)
  * Hacer swap de los docs
  * Inicializar los dos 
  * Poner en foco al contexto

  */

// Dependencias
var fs = require('fs');
var ui = require('./ui.js');

// Esta ventana se la vamos a pasar a ui.js
var gui = window.require("nw.gui");
var win = gui.Window.get();

// Empty object for this project
var project = {};

// Editor default config
var codemirror_config = {
    lineNumbers: true,
    lineWrapping: true,
    mode: ["processing", "clike"],
    keyMap: "sublime",
    autoCloseBrackets: true,
    matchBrackets: true,
    showCursorWhenSelecting: true,
    theme: "paraiso-dark",
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    viewportMargin: Infinity
}

// Save this context
var ctx = this;

// Document ready
$(document).ready(function() {

    // Get the project
    project = global.app.projects[global.app.projects.length - 1].project;

    // Set the focus app
    win.on('focus', function() {
        // console.log('Project ' + project.id + ' is now focused.');
        global.app.focused_project = project;
        ui.setFocusedWin(ctx, win);
    });

    // Codemirror Stuff
    initCodeMirror();

    // Create the sidebar
    refreshSidebar();

    // Initialize handlers
    ui.setupHandlers(window, win, ctx);

});


/*
  getMainFile()

  Devuelve el archivo principal del proyecto.
 
 */

function getMainFile() {
    var the_file;
    $.each(project.files, function(i, file) {
        if (file.type === "main") {
            the_file = file;
        }
    });
    return the_file;
}

/*
  getSecondaryFiles()

  Devuelve los archivos secundarios de los proyectos.
 
 */

function getSecondaryFiles() {
    var the_files = [];
    $.each(project.files, function(i, file) {
        if (file.type === "secondary") {
            the_files.push(file);
        };
    });
    return the_files;
}


/*
  getImageFiles()

  Devuelve todos los assets de imagenes.
 
 */

function getImageFiles() {
    var the_files = [];
    $.each(project.files, function(i, file) {
        if (file.type === "image") {
            the_files.push(file);
        };
    });
    return the_files;
}

/*
  getShaderFiles()

  Devuelve todos los archivos de shader.
 
 */

function getShaderFiles() {
    var the_files = [];
    $.each(project.files, function(i, file) {
        if (file.type === "shader") {
            the_files.push(file);
        };
    });
    return the_files;
}


/*
  getAudioFiles()

  Devuelve los archivos secundarios de los proyectos.
 
 */

function getAudioFiles() {
    var the_files = [];
    $.each(project.files, function(i, file) {
        if (file.type === "audio") {
            the_files.push(file);
        };
    });
    return the_files;
}

/*
  getPlainFiles()

  Devuelve los archivos planos, txt, xml y json.
 
 */

function getPlainFiles() {
    var the_files = [];
    $.each(project.files, function(i, file) {
        if (file.type === "txt" || file.type === "json" || file.type === "xml") {
            the_files.push(file);
        };
    });
    return the_files;
}


/*
  initCodeMirror();

  Crea la configuración de CodeMirror.

  */

function initCodeMirror() {
    initCodeMirrorDocs();
}


/*
  initCodeMirrorDocs();

  Le agrega a nuestro MainFile y a nuestros SecondaryFiles un Doc
  de Codemirror asociado.

  */


function initCodeMirrorDocs() {
    // Creamos el doc del mainFile
    if (project.declared) {
        // Proyecto declarado (si existe en en el file system, porque fue abierto o porque se guardó)
        var main_file_content = fs.readFileSync(getMainFile().abs_path);
        var doc = CodeMirror.Doc(main_file_content.toString(), "processing");
        getMainFile().doc = doc;
    } else {
        // Proyecto no declarado (el default cuando se abre codepoems)
        var doc = CodeMirror.Doc("\n//Welcome to codepoems!\n\nvoid setup(){\n\n}\n\nvoid draw(){\n\n}", "processing");
        getMainFile().doc = doc;
    }

    // Creando los docs secundarios
    for (var i = 0; i < getSecondaryFiles().length; i++) {
        var file_content = fs.readFileSync(getSecondaryFiles()[i].abs_path);
        getSecondaryFiles()[i].doc = CodeMirror.Doc(file_content.toString(), "processing");
    }

    for (var i = 0; i < getShaderFiles().length; i++) {
        var file_content = fs.readFileSync(getShaderFiles()[i].abs_path);
        getShaderFiles()[i].doc = CodeMirror.Doc(file_content.toString(), "x-shader/x-fragment");
    }



    // Creamos el CodeMirror en base al textarea
    project.editor = CodeMirror.fromTextArea(window.document.getElementById("editor"), codemirror_config);

    //Swap the default doc
    project.editor.swapDoc(getMainFile().doc, "processing");
}


/*
  swapDoc();

  Se encarga de hacer swap en el editor de CodeMirror.

  */


function swapDoc(type, index) {
    if (type === "main") {
        project.editor.swapDoc(getMainFile().doc);
    }
    if (type === "secondary") {
        project.editor.swapDoc(getSecondaryFiles()[index].doc);
    }
    if (type === "shader") {
        project.editor.swapDoc(getShaderFiles()[index].doc);
    }
}


/*
  refreshSidebar();

  Se encarga de crear el sidebar.

  */

function refreshSidebar() {

    console.log(project);

    // La limpiamos por las dudas
    $(".sidebarFiles").empty();



    // Creo los grupos
    $(".sidebarFiles").append('<div class="groupMainFile"></div>');

    if (getSecondaryFiles().length > 0) {
        $(".sidebarFiles").append('<div class="groupSecondaryFiles"></div>');
    }

    if (getImageFiles().length > 0) {
        $(".sidebarFiles").append('<div class="groupImageFiles"></div>');
    }

    if (getShaderFiles().length > 0) {
        $(".sidebarFiles").append('<div class="groupShaderFiles"></div>');
    }

    if (getPlainFiles().length > 0) {
        $(".sidebarFiles").append('<div class="groupPlainFiles"></div>');
    }

    if (getAudioFiles().length > 0) {
        $(".sidebarFiles").append('<div class="groupAudioFiles"></div>');
    }

    // Mostrar el archivo primario
    var main_file = getMainFile();
    $(".groupMainFile").append("<li class='mainFile active'><i class='icon-description'></i> " + main_file.name + "</li>");

    // Mostrar los archivos secundarios
    var secondary_files = getSecondaryFiles();
    for (var i = 0; i < secondary_files.length; i++) {
        $(".groupSecondaryFiles").append("<li class='secondaryFile'><i class='icon-description'></i> " + secondary_files[i].name + "</li>");
    }

    // Mostrar las imagenes
    var images_files = getImageFiles();
    for (var i = 0; i < images_files.length; i++) {
        $(".groupImageFiles").append("<li class='imageFile'><i class='icon-insert-photo'></i> " + images_files[i].name + "</li>");
    }

    // Mostrar los shaders
    var shader_files = getShaderFiles();
    for (var i = 0; i < shader_files.length; i++) {
        $(".groupShaderFiles").append("<li class='shaderFile'><i class='icon-texture'></i> " + shader_files[i].name + "</li>");
    }

    // Mostrar los archivos planos
    var plain_files = getPlainFiles();
    for (var i = 0; i < plain_files.length; i++) {
        $(".groupPlainFiles").append("<li class='plainFile'><i class='icon-dehaze'></i> " + plain_files[i].name + "</li>");
    }

    // Mostrar los archivos planos
    var audio_files = getAudioFiles();
    for (var i = 0; i < audio_files.length; i++) {
        $(".groupAudioFiles").append("<li class='audioFile'><i class='icon-volume-up'></i> " + audio_files[i].name + "</li>");
    }

    ui.refreshSidebarHandlers(window, win, ctx);
}