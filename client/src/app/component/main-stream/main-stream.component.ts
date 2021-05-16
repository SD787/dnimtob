import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FadeAnimation } from '../../animation/FadeAnimation';
import { ArticleService } from '../../service/communication/article.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-main-stream',
  templateUrl: './main-stream.component.html',
  styleUrls: ['./main-stream.component.scss'],
  animations: [FadeAnimation]
})
export class MainStreamComponent implements OnInit {

  @ViewChild('container') container: any;

  constructor(public articleService: ArticleService, private notificationService: NotificationService) { }

  newArticleText = '';

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.articleService.loadLastArticles(() => {
      this.checkIfNecessaryToLoadMoreArticles();
    });
  }

  onContainerScroll(): void {
    this.checkIfNecessaryToLoadMoreArticles();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkIfNecessaryToLoadMoreArticles();
  }

  postNewArticle(): void {
    this.notificationService.reset();
    if (this.newArticleText.length == 0) {
      this.notificationService.addMessage('Article is empty');
      return;
    }
    this.articleService.postArticle(this.newArticleText);
    this.newArticleText = '';
  }

  onKeydownEvent(event: KeyboardEvent): void {
    if (event.key == 'Enter' && event.ctrlKey) {
      this.postNewArticle();
    }
}

  private checkIfNecessaryToLoadMoreArticles(): void {
    if (!this.articleService.noMoreOldArticles && this.getScrollBetween0And1() == 1) {
      this.articleService.loadMoreArticles(() => {
        this.checkIfNecessaryToLoadMoreArticles();
      });
    }
  }

  private getScrollBetween0And1(): number {
    return (this.container.nativeElement.scrollTop + this.container.nativeElement.clientHeight) / this.container.nativeElement.scrollHeight;
  }

}
