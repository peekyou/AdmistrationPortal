import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModal } from '../../modals/delete.modal';
import { Picture } from '../../../models/picture';
import { guid } from '../../../helpers/utils';

@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
    _file: Picture;
    availableSpace: number;
    totalSpace = 20;
    dragging: boolean = false;
    loaded: boolean = false;
    loading: boolean = false;

    @Input() simple: boolean = false;
    @Input() browseLabel: string;
    @Input() recommendedText: string;
    @Input() files: Picture[];
    @Input() totalFileSize: number;
    @Input() fileHolder: any;
    @Input() onFileUpload: (file: Picture, fileHolder: any) => string;
    @Output() onDeleteFile: EventEmitter<Picture> = new EventEmitter();

    @Output() fileChange: EventEmitter<Picture> = new EventEmitter();    
    @Input() 
    get file(): Picture {
        return this._file;
    }

    set file(value: Picture) {
        this._file = value;
    }

    constructor(private http: HttpClient, private modalService: NgbModal) { }

    ngOnInit() {
        this.calculateAvailableSpace();
    }

    dragEnter() {
        this.dragging = true;
    }

    dragLeave() {
        this.dragging = false;
    }

    drop(e) {
        e.preventDefault();
        this.dragging = false;
        this.onFileChanged(e);
    }

    fileLoad() {
        this.loading = false;
    }

    onFileChanged(event) {
        let fileList: FileList = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        if (fileList && fileList.length > 0) {
            this.loading = true;
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            let headers = new Headers();
            /** No need to include Content-Type in Angular 4 */
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');

            let reader = new FileReader();
            reader.onload = (e: any) => {
                var newFile: Picture = {
                    src: e.target.result,
                    size: file.size,
                    name: file.name,
                    createdDate: new Date()
                };

                if (typeof this.file !== 'undefined') {
                    this._file = newFile;
                    this.fileChange.emit(this._file);
                }
                else {
                    this.onFileUpload(newFile, this.fileHolder);
                }
                this.totalFileSize += file.size / 1024 / 1024;
                this.calculateAvailableSpace();
            }
            reader.readAsDataURL(file);
        }
    }

    open(file: Picture) {
        const modalRef = this.modalService.open(DeleteModal);
        modalRef.componentInstance.title = file.name;

        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.deleteFile(file);
            }
        }, (reason) => { });
    }

    deleteFile(file: Picture) {
        this.onDeleteFile.emit(file);

        if (typeof this.file !== 'undefined') {
            this._file = null;
            this.fileChange.emit(this._file);
        }

        for (let i = 0; this.files && i < this.files.length; i++) {
            if (this.files[i].id === file.id) {
                this.totalFileSize -= file.size / 1024 / 1024;
                this.files.splice(i, 1);
                break;
            }
        }
        this.calculateAvailableSpace();
    }

    calculateAvailableSpace() {
        this.availableSpace = Math.max(0, this.totalSpace - (Math.round(this.totalFileSize * 100) / 100));
    }

    formatFileSize(size: number): string {
        if (size) {
            var unit = 'KB';
            size /= 1024;
            if (size >= 1024) {
                var unit = 'MB';
                size /= 1024;
            }
            return size.toFixed(2) + ' ' + unit; 
        }
        return '';
    }
}