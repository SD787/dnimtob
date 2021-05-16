import { Injectable } from '@angular/core';
import { Article } from '../../entitie/Article';
import { AuthService } from '../auth.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  articles: Article[] = [];
  noMoreOldArticles = false;

  constructor(private networkService: NetworkService, private authService: AuthService) {
    authService.logoutSubject.subscribe(() => {
      this.clear();
    });
  }

  loadLastArticles(next ?: ()=>void): void {
    this.networkService.makeGetWithCredential('articles')
    .subscribe((articles) => {
      this.mergeNewArticlesAtTheBeginning(articles);
      setTimeout(() => {
        if (this.authService.isAuthenticated()) {
          this.loadLastArticles();
        }
      }, 5000);
      if (next) {
        next();
      }
    });
  }

  loadMoreArticles(next ?: ()=>void): void {
    this.networkService.makeGetWithCredential('articles/skip/' + this.articles.length)
    .subscribe((newArticles) => {
      const intialSize = this.articles.length;
      this.mergeNewArticlesAtTheEnd(newArticles);
      if (intialSize == this.articles.length) {
        this.noMoreOldArticles = true;
      }
      if (next) {
        next();
      }
    })
  }

  postArticle(text: String, next ?: ()=>void) {
    this.networkService.makePostWithCredential('article/create', {'text': text})
    .subscribe(() => {
      this.loadLastArticles(next);
    });
  }

  private mergeNewArticlesAtTheBeginning(newArticles: Article[]): void {
    this.articles.unshift(...newArticles.filter(newArticle => {
      return this.articles.filter(kownArticle => kownArticle.id == newArticle.id).length == 0
    }));
  }

  private mergeNewArticlesAtTheEnd(newArticles: Article[]): void {
    newArticles.forEach(newArticle => {
      if (this.articles.filter(kownArticle => kownArticle.id == newArticle.id).length == 0) {
        this.articles.push(newArticle);
      }
    });
  }

  private clear(): void {
    this.articles = [];
    this.noMoreOldArticles = false;
  }
}
