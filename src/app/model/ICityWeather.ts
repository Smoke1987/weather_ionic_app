export interface ICityWeather {
    name: string,
    coord?: { lat: number, lon: number },
    id?: number,
    main?: {
        feels_like: number,
        temp: number,
    },
    new_item?: boolean,
}
