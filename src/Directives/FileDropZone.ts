import {Component, Input, EventEmitter, Output} from 'angular2/core';
import {FileInput} from './FileInput';
import {FileDroppa} from './FileDroppa';
import {FileList} from './FileList';

@Component({
    selector: 'fileDropZone',
    directives: [FileInput, FileDroppa, FileList],
    template: `
            <fileDroppa [class]="config.customClass"
                (fileUploaded)="updateFileList($event, 'added')"
                [overCls]="config.overCls">
            </fileDroppa>
            <fileList [files]="files" (fileRemoved)="updateFileList($event, 'removed')"></fileList>
    `
})

export class FileDropZone{
    private _config:Object = {};
    private _files = [];

    constructor(){};
    
    @Input() set config(config:Object) {
           this._config = config ? Object.assign(config, this._config) : this._config;
           console.log('this._config', this._config)
    }   
    
    @Output() fileUploaded = new EventEmitter();
    
    get config():Object {
        return this._config;
    }
    
    get files():any[]{
        return this._files;
    }

    set files(files:any[]) {
        this._files = files;
    }
    
    notifyAboutFileChanges() {
        this.fileUploaded && this.fileUploaded.emit(this.files);        
    }
    
    updateFileList(files:any[], type:string) {
        switch (type) {
            case 'added': 
                this.files = (this.files.length) 
                    ? [...this.files, ...files]
                    : files;
                break;
            case 'removed':
                this.files = files;
                break;
            default:
                this.files = [];
                break;
        }
        this.notifyAboutFileChanges();        
    }
}
