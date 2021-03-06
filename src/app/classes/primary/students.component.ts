import { AdminGuard, SecretaryGuard } from '../../utils/auth-guard.service';
import { Component, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute, Resolve, Router } from '@angular/router';

import { UserService } from '../../users/user.service';
import { FileService } from '../../utils/files.service';
import { ClassService } from "../class.service";
import { UserProfile } from '../../users/iUsers';
declare var $:any;

@Component({ 
    selector: "primary-students",
    templateUrl: "./students.component.html" 
})

export class ClassPrimaryStudentsComponent {

    public students: UserProfile[];
    public notification: any;
    public classID;

    constructor(
        private _classService: ClassService,
        private _userService: UserService,
        private _fileService: FileService,
        public _adminGuard: AdminGuard,
        public _secretaryGuard: SecretaryGuard,
        private _router: Router,
        private _route: ActivatedRoute,
    ) { this.students = []; }

    public async ngOnInit() {
        this._route.parent.params.subscribe(params =>this.classID = +params["id"]);

        let studentIDs = await this._classService.getStudentsByClass(this.classID);
        console.log(studentIDs)
        for (var i = 0; i < studentIDs.length; i++) {
            this.students[i] = await this._userService.getProfile(studentIDs[i]);
            console.log(this.students[i]);
        }
        
        for (let student of this.students) {
            this._fileService.imageDownload(student.Photo)
                .subscribe((res) => {
                    student.Photo = res;
                });
        }
        this.students.sort(function(a,b) {
            return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0);
        }); 
    }
}