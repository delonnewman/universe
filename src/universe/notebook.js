// jshint eqnull: true
// jshint esversion: 6
var universe = universe || {};
universe.notebook = (function() {

    if (universe.core == null) {
        throw new Error('universe.core must be loaded first');
    }
    
    // imports
    var html = universe.core.html,
        _ = universe.core;

    function NoteBook(id, options) {
        this.$notebook$id = id;
        this.$notebook$elem = document.getElementById(id);
        this.$notebook$options = options || {};
        this.$notebook$inputIndex = 0;
        this.$notebook$outputIndex = 0
        this.$notebook$editors = {};
        this.$notebook$history = [];
    }

    NoteBook.prototype = Object.create(null);

    NoteBook.prototype.inputId = function() {
        return _.str('notebook-input-', this.$notebook$inputIndex);
    }

    NoteBook.prototype.input = function() {
        var callback = _.str("universe.notebook('", this.$notebook$id, "').evalCurrentInput()");
        return ['div', {class: 'row notebook-input-container mb-3'},
            ['div', {class: 'col-1'}, ['h1', this.$notebook$inputIndex]],
            ['div', {class: 'col-11'},
                ['div', {id: this.inputId(), class: 'notebook-input mb-1'}],
                ['button', {type: 'button', onclick: callback, class: 'btn btn-primary btn-sm'}, "Evaluate"]]];
    }

    NoteBook.prototype.outputId = function() {
        return _.str('notebook-output-', this.$notebook$outputIndex);
    }

    NoteBook.prototype.output = function(value) {
        return ['div', {class: 'row notebook-output-container'},
            ['div', {class: 'col-1'}],
            ['div', {id: this.outputId(), class: 'col-11 notebook-output'},
                ['code', _.printStr(value)]]];
    }

    // Actions
    NoteBook.prototype.addNewInput = function() {
        _.appendTo(this.$notebook$elem, _.html(this.input()));
        this.initEditor(this.inputId());
        return this;
    };

    NoteBook.prototype.evalCurrentInput = function() {
        var editor = this.$notebook$editors[this.inputId()];
        _.appendTo(this.$notebook$elem, _.html(this.output(eval(editor.getValue()))));
        this.$notebook$inputIndex++;
        this.$notebook$outputIndex++;
        this.addNewInput();
    };

    NoteBook.prototype.initEditor = function(id) {
        console.log("Initializing editor for: " + id);
        var editor = ace.edit(id);
        editor.setTheme("ace/theme/solarized_dark");
        editor.session.setMode("ace/mode/javascript");
        this.$notebook$editors[id] = editor // add to editor index
    };

    NoteBook.prototype.init = function() {
        if (this.initialized !== true) {
            this.addNewInput();
        }
    }

    return _.memoize(function (id) {
        return new NoteBook(id);
    });

}.call(this));
