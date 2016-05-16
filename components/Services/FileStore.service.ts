import {Injectable, EventEmitter} from "@angular/core";
import {FileUpload} from "./FileUpload.service";
import {iFile} from "./FileWrapper.service";
import {FileWrapper} from "./FileWrapper.service";

@Injectable()
export class FilesStore {
    public fileUploaded = new EventEmitter(true);
    public uploadConfig;

    private WSfiles:WeakSet<File> = new WeakSet();
    private _iFiles:Array<iFile> = [];

    private isFileValid(file:File){
        if(!this.uploadConfig.validateFile ||
            (typeof this.uploadConfig.validateFile==="function" && this.uploadConfig.validateFile(file))){
            return true;
        }
        return false;
    }
    public get files():Array<File> {
        return this.iFiles.reduce((res, iFile:iFile)=> {
            res.push(iFile.File);
            return res;
        }, []);
    }

    public get iFiles() {
        return this._iFiles;
    }

    public set iFiles(files) {
        this._iFiles = files;
    }

    public addFiles(files):void {
        files = files.filter((file)=> {
            if (!this.WSfiles.has(file) && this.isFileValid(file)) {
                this.WSfiles.add(file);
                return true;
            }
        }).map((file)=> {
            let iFile = new FileWrapper(file,  this.uploadConfig);
            iFile.fileUploaded.subscribe(([success, response, iFile])=>{
                this.notifyFileUploaded(success, response, iFile);
            });
            return iFile;
        });
        this.iFiles = [...this.iFiles, ...files];
    }

    public notifyFileUploaded(success, response, iFile){
        if(this.uploadConfig.removeWhenUploaded && success){
            this.removeFiles(iFile);
        }
        this.fileUploaded.emit([success, response, iFile.File]);
    }

    public removeFiles(iFile:iFile):void {
        this.WSfiles.delete(iFile.File);
        this.iFiles = this.iFiles.filter((item)=>{
            return item.id !== iFile.id;
        });
    }

    public clearStore():void {
        this.iFiles.forEach((iFile)=> {
            this.WSfiles.delete(iFile.File);
        });
        this.iFiles = [];
    }
}