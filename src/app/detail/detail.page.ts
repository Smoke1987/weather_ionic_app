import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormStyle, getLocaleDayNames, TranslationWidth } from '@angular/common';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.page.html',
    styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
    
    lat: number;
    lon: number;
    name: string;
    
    currentForecastLength = 'one';
    
    daysWeather: any[];
    currentWeather: any;
    hourlyWeather: any[];
    
    dayNames;
    
    constructor( private activatedRoute: ActivatedRoute,
                 private router: Router,
                 private apiService: ApiService,
    ) {
    }
    
    ngOnInit() {
        this.name = this.activatedRoute.snapshot.queryParamMap.get('name');
        
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if ( params.hasOwnProperty('lat') && params.hasOwnProperty('lon') ) {
                this.lat = params.lat;
                this.lon = params.lon;
                this.detailWeatherForecast(this.lat, this.lon);
            }
        });
    
        let dayNames = getLocaleDayNames('ru', FormStyle.Format, TranslationWidth.Wide);
        if (dayNames[0] != 'понедельник') {
            let sunday = dayNames.splice(0, 1);
            dayNames.push(sunday[0]);
        }
        this.dayNames = dayNames;
    }
    
    async detailWeatherForecast ( lat, lon, refresher? ) {
        let dailyForecastResult = await this.apiService.getDetailWeatherForecast(lat, lon);

        if ( dailyForecastResult.success ) {
            this.daysWeather = dailyForecastResult.weather.daily;
            this.currentWeather = dailyForecastResult.weather.current;
            this.hourlyWeather = dailyForecastResult.weather.hourly;
        }
        
        if ( refresher ) {
            refresher.complete();
        }
    }
    
    doRefresh( $event ) {
        this.detailWeatherForecast(this.lat, this.lon, $event.target);
    }
}
