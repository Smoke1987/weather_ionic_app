import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component( {
	selector: 'day-weather',
	templateUrl: 'day-weather.html',
	styleUrls: ['day-weather.scss']
} )
export class DayWeatherComponent implements OnChanges {
	
	@Input() item: any;
	@Input() listIndex: number;
	@Input() dayNames;
	@Input() isCurrent = false;
	@Input() hourlyWeather: any;
	
	todayGroup = [];
	tomorrowGroup = [];
	
	constructor (  ) {
	
	}
	
	ngOnChanges () {
		this.groupingForecast();
	}
	
	groupingForecast () {
		if ( this.item ) {
			if ( this.isCurrent ) {
				this.todayGroup = [];
				this.tomorrowGroup = [];
				
				let i = 0;
				let count = 0;
				let _currentDay = new Date(this.item.dt * 1000).getDay();
				
				while ( count < 24 ) {
					let _hourlyItem = this.hourlyWeather[i++];
					
					if ( _hourlyItem.dt > this.item.dt ) {
						let _hourlyDay = new Date(_hourlyItem.dt * 1000).getDay();
						let isAnotherDay = _hourlyDay !== _currentDay;
						if ( !isAnotherDay ) {
							this.todayGroup.push(_hourlyItem);
						} else {
							this.tomorrowGroup.push(_hourlyItem);
						}
						count++;
					}
				}
			}
		} else {
			setTimeout( () => {
				this.groupingForecast();
			}, 100);
		}
	}
	
	getDividerLabel(dayWeather, i) {
		let text = '';
		switch ( i ) {
			case 0:
				text = 'Сегодня';
				break;
			case 1:
				text = 'Завтра';
				break;
			case 2:
				text = 'Послезавтра';
				break;
			default:
				let dateWeather = new Date(dayWeather.dt * 1000);
				let day = dateWeather.getDay();
				text = this.dayNames[day-1];
				text = text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
				break;
		}
		// если не 1 день
		if ( !this.isCurrent ) {
			//text += ` от ${this.item.temp.min}\u00B0C до ${this.item.temp.max}\u00B0C`;
		}
		return text;
	}
	
}
