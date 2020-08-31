import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-courses-layout',
  styleUrls: ['./courses-layout.component.scss'],
  templateUrl: './courses-layout.component.html',
})
export class CoursesLayoutComponent implements OnDestroy {
  @ViewChild('sidenav') sidenav: MatSidenav;
  public mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  public isLeftMenuOpened = true;
  public isRightMenuOpened = true;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

  }

  public ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  public toggleLeftMenu(): void {
    this.isLeftMenuOpened = !this.isLeftMenuOpened;
  }

  public toggleRightMenu(): void {
    this.isRightMenuOpened = !this.isRightMenuOpened;
  }

}
