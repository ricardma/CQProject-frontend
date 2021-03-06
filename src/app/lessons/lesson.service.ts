// Imports
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'materialize-css';
import { toast } from 'materialize-css';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { API } from '../../main';
import { Lesson } from "./iLesson";
import { Presence } from "./iPresence";

@Injectable()
export class LessonService {

    private _headers: Headers;
    private _options: RequestOptions;
    private readonly _apiURL = API.url;

    constructor(private _http: Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json; charset=utf-8');
        this._headers.append('Authorization', <string>JSON.parse(localStorage.getItem('currentUser')).token);
        this._options = new RequestOptions({ headers: this._headers });
    }

    public async getLessonBySubject(subjectID: number, classID: number): Promise<Lesson[]> {
        let response = await this._http
            .get(this._apiURL + `/lesson/list/${subjectID}/${classID}`, this._options)
            .toPromise();

        if (response.json().result) return response.json().data;
        else {
            console.log(response.json().info);
            return null;
        }
    }

    public async getPresenceByTeacher(lessonID: number): Promise<Presence[]> {
        let response = await this._http
            .get(this._apiURL + `/lesson/teacher/${lessonID}`, this._options)
            .toPromise();

        if (response.json().result) return response.json().data;
        else {
            console.log(response.json().info);
            return null;
        }
    }

    public async getPresenceByStudent(lessonID: number): Promise<Presence> {
        let response = await this._http
            .get(this._apiURL + `/lesson/student/${lessonID}`, this._options)
            .toPromise();

        if (response.json().result) return response.json().data;
        else {
            console.log(response.json().info);
            return null;
        }
    }

    public async getPresenceByGuardian(lessonID: number): Promise<Presence[]> {
        let response = await this._http
            .get(this._apiURL + `/lesson/guardian/${lessonID}`, this._options)
            .toPromise();

        if (response.json().result) return response.json().data;
        else {
            console.log(response.json().info);
            return null;
        }
    }

    public async createLesson(lesson: any){
        var toPost = JSON.stringify({
            Summary:lesson.Summary,
            Homework:lesson.Homework,
            Observations:lesson.Observations,
            Day: Date.now(),
            ScheduleFK: lesson.ScheduleFK
        });
        let response = await this._http
            .post(this._apiURL + `/lesson/summary`,toPost, this._options)
            .toPromise();
        if (response.json().result) {
            toast("Lição criada com sucesso", 4000,'lime');
            return response.json().data;
        }
        else {
            toast(response.json().info, 4000,'red');
            return null;
        }
    }

    public async createPostFaults(lessonStudent:any){
        let response = await this._http
        .post(this._apiURL + `/lesson/faults`,JSON.stringify(lessonStudent), this._options)
        .toPromise();
        if (response.json().result)  return response.json().data;
        else {
            toast(response.json().info, 4000,'red')
        }
    }

    private _handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || "Server error");
    }
}