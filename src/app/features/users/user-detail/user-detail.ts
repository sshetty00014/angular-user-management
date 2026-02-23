import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../user-table/user-table';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail implements OnInit {

  user = signal<User | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUsers().subscribe(users => {
      const found = users.find(u => u.id === id);
      this.user.set(found || null);
    });
  }

  goBack() {
    this.router.navigate(['/users']);
  }
}