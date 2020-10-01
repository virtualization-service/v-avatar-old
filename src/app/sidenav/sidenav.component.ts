import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListernerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListernerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListernerSubs.unsubscribe();
  }

  downloadMyFile() {
    const link = document.createElement('a');
    link.setAttribute('target', '_new');
    link.setAttribute('href', 'assets/virtualization-help.pdf');
    link.setAttribute('download', 'assets/virtualization-help.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
