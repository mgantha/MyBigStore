import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router:Router,
    private dashboardService:DashboardService,
  ) { }
  logout(){
    
    this.dashboardService.purgeAuth();
    this.router.navigate(['/login']);
}


  ngOnInit() {
  }

}
