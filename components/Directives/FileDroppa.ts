import {Directive, ElementRef, Renderer, Input, EventEmitter, Output} from '@angular/core';
import {FileParser} from "../Services/FileParser.service";
import {FilesStore} from "../Services/FileStore.service";

@Directive({
    selector: 'fileDroppa, [fileDroppa]',
    providers: [FileParser],
    host: {
        '(drop)': 'drop($event)',
        '(dragenter)': 'dragenter($event)',
        '(dragover)': 'dragover($event)',
        '(dragleave)': 'dragleave($event)',
        '(click)': 'onClick($event)'
    }
})
export class FileDroppa {
    private _overCls:string = "defaultOver";
    private hiddenFileInput = null;
    private filesStore: FilesStore = new FilesStore();

    constructor(private el:ElementRef, private renderer:Renderer, private fileParser:FileParser) {
        this.createHiddenInput();
    }

    /*
     * Directive Input and Output Params
     * */

    @Input() set fs(fs:FilesStore) {
        this.filesStore = fs;
    }

    @Input() set overCls(overCls:string) {
        this._overCls = overCls || this._overCls;
    }

    @Output() notifyFilesUpdated = new EventEmitter();

    /*
     * Host Event Listeners
     * */

    onClick(e) {
        this.hiddenFileInput && this.hiddenFileInput.click();
    }

    drop(e) {
        e.preventDefault();
        if (!e.dataTransfer || !e.dataTransfer.files.length) {
            return;
        }
        this.fileParser.processInputFromDrop(e)
            .then((files)=> {
                this.updateFilesStore([...files]);
            });
        this.updateStyles();
    }

    dragenter(e) {
        e.preventDefault()
    }

    dragover(e) {
        e.preventDefault();
        this.updateStyles(true);
    }

    dragleave(e) {
        e.preventDefault();
        this.updateStyles();
    }

    /*
     * Public methods
     * */

    OnDestroy() {
        this.hiddenFileInput && document.body.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
    }

    updateStyles(dragOver:boolean = false) {
        this.el.nativeElement.classList[(dragOver) ? 'add' : 'remove'](this._overCls);
    }

    updateFilesStore(files:Array<File>):void {
        this.filesStore.addFiles(files);
        this.notifyFilesUpdated.emit(this.filesStore.files);
    }

    createHiddenInput() {
        this.hiddenFileInput && document.body.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = document.createElement("input");
        this.hiddenFileInput.setAttribute("type", "file");
        this.hiddenFileInput.setAttribute("multiple", "multiple");
        this.hiddenFileInput.style.visibility = "hidden";
        this.hiddenFileInput.style.position = "absolute";
        this.hiddenFileInput.style.top = "0";
        this.hiddenFileInput.style.left = "0";
        this.hiddenFileInput.style.height = "0";
        this.hiddenFileInput.style.width = "0";
        this.hiddenFileInput.className = "_hiddenInputClassName";
        document.body.appendChild(this.hiddenFileInput);
        this.hiddenFileInput.addEventListener("change", (e)=> {
            let files = [];
            for(let i = 0, l = e.target.files.length;i<l;i++){
                files.push(e.target.files[i]);
            }
            this.hiddenFileInput.value = "";
            this.updateFilesStore(files);
        });
    }

}