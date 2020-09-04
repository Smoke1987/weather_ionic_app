import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICityWeather } from '../model/ICityWeather';
import { ApiService } from '../services/api.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { merge } from 'rxjs';
import { scan } from 'rxjs/internal/operators/scan';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
    citiesWeather$: Observable<ICityWeather[]>;
    citiesWeatherSubscription: Subscription;
    
    newCityWeatherSubscription: Subscription;
    
    public cities: ICityWeather[] = [];
    
    allCityUpdated = false;
    
    deleteSubject = new Subject<any>();
    addSubject = new Subject<any>();
    updateSubject = new Subject<any>();
    
    searchItems = [];
    isSearchComplete = false;
    searchText = '';
    
    constructor( private apiService: ApiService, private storageService: StorageService, ) {
        const citiesFromStorage = this.storageService.allCitiesList();
        this.citiesWeather$ = merge(citiesFromStorage, this.deleteSubject.asObservable(), this.addSubject.asObservable(), this.updateSubject.asObservable()).pipe(
            scan(( acc, data ) => {
                if ( data && data.command ) {
                    switch ( data.command ) {
                        case 'add':
                            let isExistsIndex = acc.findIndex(( city ) => city.name === data.value.name);
                            if ( isExistsIndex == -1 ) {
                                acc.unshift(data.value);
                            } else {
                                acc[isExistsIndex] = data.value;
                            }
                            break;
                        case 'update':
                            let updateIndex = acc.findIndex(( city ) => city.name === data.value.name);
                            acc[updateIndex] = data.value;
                            break;
                        case 'delete':
                            let deleteIndex = acc.findIndex(( city ) => city.name === data.value.name);
                            if ( deleteIndex > -1 ) {
                                acc.splice(deleteIndex, 1);
                            }
                            break;
                    }
                }
                
                return acc;
            })
        );
    }
    
    async ngOnInit() {
        this.citiesWeatherSubscription = this.citiesWeather$.subscribe(( cities: ICityWeather[] ) => {
            this.cities = cities;
            
            if ( !this.allCityUpdated ) {
                this.refreshAllCitiesWeather();
            }
            
            this.saveCities(this.cities);
        });
        
        this.newCityWeatherSubscription = this.apiService.newCityWeatherSubject.subscribe(( cityWeather: ICityWeather ) => {
            this.addSubject.next({command: 'add', value: cityWeather});
        });
        
        this.storageService.getCities();
    }
    
    ngOnDestroy(): void {
        if ( this.citiesWeatherSubscription && !this.citiesWeatherSubscription.closed ) {
            this.citiesWeatherSubscription.unsubscribe();
        }
        if ( this.newCityWeatherSubscription && !this.newCityWeatherSubscription.closed ) {
            this.newCityWeatherSubscription.unsubscribe();
        }
    }
    
    async refreshAllCitiesWeather( refresher? ) {
        let _promises: any[] = [];
        
        for ( let i = 0; i < this.cities.length; i++ ) {
            let city = this.cities[i];
            let _promise = this.apiService.getCurrentWeather(city.name, true, true);
            _promises.push(_promise);
        }
        this.allCityUpdated = true;
        
        Promise.all(_promises).then(() => {
            if ( refresher ) {
                refresher.complete();
            }
        });
    }
    
    doRefresh( $event ) {
        this.refreshAllCitiesWeather($event.target);
    }
    
    onCitySwipe( $event ) {
        this.deleteCityWeather($event.cityWeather);
    }
    
    async onSearch( $event ) {
        let _searchText = $event.detail.value;
        
        if ( !_searchText || _searchText == "" ) {
            this.isSearchComplete = false;
            return;
        }
        
        if ( $event.detail.value.length < 3 ) {
            this.isSearchComplete = false;
            return;
        }
    
        this.apiService.getCurrentWeather(_searchText, true).then((searchResult: any) => {
            this.isSearchComplete = true;
            searchResult.new_item = true;
            this.searchItems = [searchResult];
            
        }, (searchError: any) => {
            this.isSearchComplete = true;
            this.searchItems = [{name: 'город не найден'}];
        });
    }
    
    onClearText() {
        this.searchText = '';
        this.isSearchComplete = false;
        this.searchItems = [];
    }
    
    onSearchedItemClicked( searchItem ) {
        if ( searchItem.coord ) {
            this.addSubject.next({command: 'add', value: searchItem});
        }
    
        this.isSearchComplete = false;
        this.searchItems = [];
        this.searchText = '';
    }
    
    deleteCityWeather( cityWeather: ICityWeather ) {
        this.deleteSubject.next({command: 'delete', value: cityWeather});
    }
    
    saveCities( cities: ICityWeather[] ) {
        this.storageService.setCities(this.cities);
    }
    
}
