import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NewsService } from './app/news.service';
import { ThemeService } from './app/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div [class]="isDarkTheme ? 'dark' : 'light'" class="min-h-screen transition-colors duration-300" [style.background-color]="isDarkTheme ? 'var(--bg-primary)' : 'var(--bg-primary)'">
      <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold" [style.color]="isDarkTheme ? 'var(--text-primary)' : 'var(--text-primary)'">
            Global News
          </h1>
          <button (click)="toggleTheme()" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <i [class]="isDarkTheme ? 'fas fa-sun' : 'fas fa-moon'" class="text-xl" [style.color]="isDarkTheme ? 'var(--text-primary)' : 'var(--text-primary)'"></i>
          </button>
        </div>

        <div class="mb-8">
          <div class="flex gap-4">
            <select
              [(ngModel)]="selectedCountry"
              (change)="searchNews()"
              class="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            >
              <option value="us">United States</option>
              <option value="gb">United Kingdom</option>
              <option value="in">India</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="fr">France</option>
              <option value="de">Germany</option>
              <option value="jp">Japan</option>
            </select>
            <button
              (click)="searchNews()"
              class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh News
            </button>
          </div>
        </div>

        <div *ngIf="newsData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
          <div *ngFor="let article of paginatedArticles()" class="news-card rounded-xl overflow-hidden shadow-lg" [style.background-color]="isDarkTheme ? 'var(--card-bg)' : 'var(--card-bg)'">
            <img [src]="article.urlToImage" [alt]="article.title" class="w-full h-48 object-cover">
            <div class="p-6">
              <div class="flex items-center mb-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ article.source }}
                </span>
                <span class="mx-2 text-gray-500 dark:text-gray-400">•</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ article.publishedAt | date:'mediumDate' }}
                </span>
              </div>
              <h2 class="text-xl font-semibold mb-2" [style.color]="isDarkTheme ? 'var(--text-primary)' : 'var(--text-primary)'">
                {{ article.title }}
              </h2>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ article.description }}
              </p>
              <a [href]="article.url" target="_blank" class="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Read More
                <i class="fas fa-external-link-alt ml-2"></i>
              </a>
            </div>
          </div>
        </div>

        <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <span class="block sm:inline">{{ error }}</span>
        </div>

        <div *ngIf="!newsData && !error" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <div *ngIf="newsData" class="flex justify-center mt-6">
          <button (click)="prevPage()" [disabled]="currentPage === 1" class="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50">Previous</button>
          <span class="px-4 py-2">Page {{ currentPage }} of {{ totalPages() }}</span>
          <button (click)="nextPage()" [disabled]="currentPage >= totalPages()" class="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  `
})
export class App implements OnInit {
  selectedCountry: string = 'us';
  newsData: any;
  error: string = '';
  isDarkTheme: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private newsService: NewsService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.searchNews();
    this.themeService.isDarkTheme$.subscribe(
      isDark => this.isDarkTheme = isDark
    );
  }

  searchNews() {
    this.newsData = null;
    this.error = '';
    
    this.newsService.getNews(this.selectedCountry, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.newsData = data;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Failed to fetch news. Please try again.';
        console.error('News fetch error:', err);
      }
    });
  }

  paginatedArticles() {
    return this.newsData?.articles || [];
  }

  totalPages(): number {
    return this.newsData ? Math.ceil(this.newsData.totalResults / this.pageSize) : 0;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.searchNews();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchNews();
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
  ]
});
