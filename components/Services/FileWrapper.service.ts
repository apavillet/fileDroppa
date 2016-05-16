import {EventEmitter} from "@angular/core";
import {FileUpload} from "./FileUpload.service";

export interface iFile {
    File:File,
    removing:boolean,
    loading:boolean,
    percentage:number,
    id:string,
    loadingSuccessful:any,
    fileUploaded:any,
    uploader:FileUpload
}

export class FileWrapper {
    public File;
    public loading = false;
    public percentage = 0;
    public removing = false;
    public id = Math.random().toString(36).substr(2);
    public loadingSuccessful = null;
    public fileUploaded = new EventEmitter(false);
    public uploader = null;

    constructor(file, uploadConfig){
        this.File = file;
        this.uploader = new FileUpload(this,
            uploadConfig.autoUpload, uploadConfig.requestHeaders,
            uploadConfig.uploadUrl, uploadConfig.beforeUpload);
    }
}