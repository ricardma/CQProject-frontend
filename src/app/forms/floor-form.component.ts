import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FloorService } from '../sensors/floor.service';
import { SchoolService } from '../schools/school.service';
import { FileService } from "../utils/files.service";

import { School } from "../schools/iSchool";
import { Floor } from "../sensors/iFloor";

@Component({
    selector: "floor-form",
    templateUrl: "./floor-form.component.html"
})

export class FloorFormComponent {

    schools: School[];
    floor: Floor;
    image: File;

    constructor(
        private _floorService: FloorService,
        private _schoolService: SchoolService,
        private _fileService: FileService,
        private _route: ActivatedRoute
    ) { this.floor = new Floor(); }

    public async ngOnInit() {
        this.schools = await this._schoolService.getSchools();
    }

    public getImage(event) {
        this.image = event.target.files[0];
    }

    public async createFloor() {
        this.floor.Image = await this._fileService.imageUpload(this.image);
        var result = await this._floorService.createFloor(this.floor);
        if(result) location.reload();
    }
}