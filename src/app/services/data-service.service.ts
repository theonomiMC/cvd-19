import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CovidInfo } from '../covid-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  covid_url: string = 'https://corona-api.com/countries';
  // covid_url: string =
  //   'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total';
  // options = new HttpHeaders({
  //   method: 'GET',
  //   headers:String(
  //     'X-RapidAPI-Key': '12ba44ee65msh1ea1fa25c966865p128bd5jsn983e3b3f24dd',
  //     'X-RapidAPI-Host': 'covid-19-coronavirus-statistics.p.rapidapi.com',)
  //   },
  // );
  timeline = 'https://corona-api.com/timeline';
  constructor(private http: HttpClient) {}

  getGlobalData(): Observable<CovidInfo[]> {
    return this.http.get<CovidInfo[]>(this.covid_url);
  }
  getTimeline(): Observable<CovidInfo[]> {
    return this.http.get<CovidInfo[]>(this.timeline);
  }
}
