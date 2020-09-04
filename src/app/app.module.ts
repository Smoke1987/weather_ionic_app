import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, isPlatform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpMock } from '../assets/mocks/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { NetworkGuard } from './route-guards/NetworkGuard';

import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { Network } from '@ionic-native/network/ngx';

registerLocaleData( localeRu );

const getImports = ( imports ) => {
    if ( isPlatform('desktop') ) {
        imports.push(HttpClientModule);
    }
    return imports;
};

const provideHttp = () => {
    if ( isPlatform('desktop') ) {
        console.log('AppModule @ run in desktop platform -> use HttpMock provider');
        
        return {provide: HTTP, useClass: HttpMock};
    } else {
        console.log('AppModule @ run in cordova platform -> use Native HTTP');
        
        return {provide: HTTP, useClass: HTTP};
    }
};

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: getImports([
        BrowserModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        AppRoutingModule
    ]),
    providers: [
        StatusBar,
        SplashScreen,
        NetworkGuard, Network,
        provideHttp(),
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: LOCALE_ID, useValue: 'ru'},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
