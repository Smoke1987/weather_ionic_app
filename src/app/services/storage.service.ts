import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ICityWeather } from '../model/ICityWeather';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    
    defaultCities: ICityWeather[] = [
        { name: 'Москва' },
        { name: 'Ростов-на-Дону' },
    ];
    
    citiesSubject = new Subject();
    
    constructor( private storage: Storage ) {
    }
    
    async getCities () {
        let _citiesFromStorage = await this.storage.get('cities');
        
        if ( _citiesFromStorage && _citiesFromStorage.length > 0 ) {
            this.citiesSubject.next(_citiesFromStorage);
        } else {
            this.citiesSubject.next(this.defaultCities);
        }
    }
    
    setCities ( cities: ICityWeather[] ) {
        this.storage.set('cities', cities);
    }
    
    public allCitiesList () {
        return this.citiesSubject.asObservable();
    }
}
