import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'b6f77dfab41a59f39a4f1cd219616b89';
  private baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const url = `${this.baseUrl}?q=${city}&APPID=${this.apiKey}&units=metric`;
    return this.http.get(url).pipe(
      map((response: any) => {
        return {
          city: response.city.name,
          list: response.list.map((item: any) => ({
            temp: Math.round(item.main.temp),
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            date: new Date(item.dt * 1000)
          }))
        };
      })
    );
  }
}