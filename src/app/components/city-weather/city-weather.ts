import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICityWeather } from '../../model/ICityWeather';
import { GestureController } from '@ionic/angular';

@Component( {
	selector: 'city-weather',
	templateUrl: 'city-weather.html',
	styleUrls: ['city-weather.scss']
} )
export class CityWeatherComponent implements OnInit, AfterViewInit {
	@ViewChild('cityCard', {read: ElementRef, static: false}) card: ElementRef;
	
	@Input() cityWeather: ICityWeather;
	@Output() onSwipe = new EventEmitter();
	
	isPopOut = false;
	isNewAnimationLoaded = false;
	
	constructor ( private sanitizer: DomSanitizer, private gestureCtrl: GestureController ) {
	}
	
	ngOnInit () {
		setTimeout(() => {
			this.isNewAnimationLoaded = true;
		}, 2000);
	}
	
	ngAfterViewInit(): void {
		this.initGesture();
	}
	
	initGesture () {
		if ( !this.card ) {
			setTimeout(() => {
				this.initGesture();
			}, 100);
		} else {
			const style = this.card.nativeElement.style;
			const windowWidth = window.innerWidth;
			
			const gesture = this.gestureCtrl.create({
				el: this.card.nativeElement,
				gestureName: 'swipe-2/5-gesture',
				onMove: (detail) => {
					style.transform = `translateX(${detail.deltaX}px)`;
				},
				onEnd: (detail) => {
					style.transition = "0.3s ease-out";
					
					if(detail.deltaX > windowWidth * 2 / 5){
						style.transform = `translateX(${windowWidth * 1.5}px)`;
						this.isPopOut = true;
						setTimeout(() => {this.onSwipe.emit({direction: 'right', cityWeather: this.cityWeather });}, 250);
					} else if (detail.deltaX < -windowWidth * 2 / 5){
						style.transform = `translateX(-${windowWidth * 1.5}px)`;
						this.isPopOut = true;
						setTimeout(() => {this.onSwipe.emit({direction: 'left', cityWeather: this.cityWeather });}, 250);
					} else {
						style.transform = '';
					}
				}
			}, true);
			
			gesture.enable();
		}
	}
	
}
