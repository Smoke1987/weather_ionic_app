import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface HTTPResponse {
    /**
     * The status number of the response
     */
    status: number;
    /**
     * The headers of the response
     */
    headers: any;
    /**
     * The URL of the response. This property will be the final URL obtained after any redirects.
     */
    url: string;
    /**
     * The data that is in the response. This property usually exists when a promise returned by a request method resolves.
     */
    data?: any;
    /**
     * Error response from the server. This property usually exists when a promise returned by a request method rejects.
     */
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class HttpMock {
    
    constructor ( private http: HttpClient, ) {
    
    }
    
    /**
     * Make a POST request
     * @param url {string} The url to send the request to
     * @param body {Object} The body of the request
     * @param headers {Object} The headers to set for this request
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    post(url: string, body: any, headers: any): Promise<HTTPResponse> {
        let response: HTTPResponse;
    
        console.log('HttpMock @ post():: ', {url, body, headers});
    
        return this.http.post<Object>(url, body, {headers: headers}).pipe(
            map(( response ) => {
                console.log('HttpMock @ post -> RESPONSE:: ', {url, body, headers, response});
            
                return response;
            }),
            catchError(this.handleError.bind(this, {reason: 'catch from call API'}))
        ).toPromise();
    };
    /**
     *
     * @param url {string} The url to send the request to
     * @param parameters {Object} Parameters to send with the request
     * @param headers {Object} The headers to set for this request
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    get(url: string, parameters: any, headers: any): Promise<HTTPResponse> {
        console.log('HttpMock @ get():: ', {url, parameters, headers});
    
        return this.http.get<Object>(url, {params: parameters, headers: headers}).pipe(
            map(( response ) => {
                console.log('HttpMock @ get -> RESPONSE:: ', {url, parameters, headers, response});
                
                return response;
            }),
            catchError(this.handleError.bind(this, {reason: 'catch from call API'}))
        ).toPromise();
    };
    
    private handleError( handleErrorData, error: HttpErrorResponse ) {
        console.log('HttpMock @ handleError():: ', {error, handleErrorData});
        if ( error.error instanceof ErrorEvent ) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('HttpMock @ handle HTTP error -> An error occurred (client-side)', {error});
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`ApiService @ handle HTTP error -> Backend returned code ${ error.status }`, {error});
        }
        
        // return an observable with a user-facing error message
        return throwError(error.error);
    };
    
}
