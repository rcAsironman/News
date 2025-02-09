import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  // private apiUrl = 'https://newsapi.org/v2/top-headlines';
  private apiUrl = 'https://script.google.com/macros/s/AKfycbxySg8sTbVuDwr_sOc3orIuSFDxH4VQbrvHTPCoBmfDalzv1S5c7V6w0qrmUmcqXNzXFg/exec';


  constructor(private http: HttpClient) {}

  getNews(country: string = 'us', page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?country=${country}&pageSize=${pageSize}&page=${page}&apikey=${'d0bc767c45604760bb11a49cb4d48768'}`).pipe(
      map((response: any) => {
        return {
          articles: response.articles.map((article: any) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image',
            publishedAt: new Date(article.publishedAt),
            source: article.source.name
          })),
          totalResults: response.totalResults 
        };
      }),
      catchError(error => {
        console.error('API Error:', error);
        return of({
          articles: [
            {
              title: 'Sample News Article',
              description: 'This is a sample news article for testing purposes.',
              url: '#',
              urlToImage: 'https://via.placeholder.com/400x200?text=Sample+News',
              publishedAt: new Date(),
              source: 'Sample Source'
            }
          ],
          totalResults: 0
        });
      })
    );
  }
}