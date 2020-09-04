import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { ICityWeather } from '../model/ICityWeather';
import { Subject } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    api_url = 'http://api.openweathermap.org/data/2.5/';
    current_weather_end_point = 'weather?';
    detail_weather_forecats_end_point = 'onecall?';
    APPID = '60291c589b36f27694dc1474f339aa29';
    
    requestParams = {
        lang: 'ru',
        units: 'metric',
        appid: this.APPID
    };
    
    public newCityWeatherSubject = new Subject();
    
    constructor( private http: HTTP, private platform: Platform, ) {
    
    }
    
    getCurrentWeather( cityName: string, getPromise = false, autoRefreshList = false ) {
        let params = {
            ...this.requestParams,
            q: cityName
        };
    
        let promise = new Promise<any>( (resolve, reject) => {
            this.http.get(this.api_url + this.current_weather_end_point, params, {}).then(( response: any ) => {
                if ( this.platform.is('cordova') ) {
                    if ( response.status == 200 ) response = JSON.parse(response.data);
                }
                if (autoRefreshList) this.refreshCityWeather(response);
                resolve(response);
            }).catch(( error: any ) => {
                console.log('ApiService @ getCurrentWeather():: ERROR', {cityName, error});
                reject(error);
            });
        });
        
        if (getPromise) {
            return promise;
        }
    }
    
    refreshCityWeather ( cityWeather: ICityWeather ) {
        this.newCityWeatherSubject.next(cityWeather);
    }
    
    getDetailWeatherForecast ( lat: number, lon: number ) {
        return new Promise<any>( (resolve, reject) => {
            let params = {
                ...this.requestParams,
                lat, lon, exclude: 'minutely'
            };
    
            this.http.get(this.api_url + this.detail_weather_forecats_end_point, params, {}).then(( response: any ) => {
                if ( this.platform.is('cordova') ) {
                    if ( response.status == 200 ) response = JSON.parse(response.data);
                }
                if ( response.daily ) {
                    resolve({success: true, weather: response});
                } else {
                    resolve({success: false, response});
                }
            }).catch(( error: any ) => {
                console.log('ApiService @ getDetailWeatherForecast():: ERROR', {lat, lon, error});
                
                reject({error});
            });
        });
    }
    
}
