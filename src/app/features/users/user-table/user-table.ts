import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  email: string;
  web: string;
  company_name: string;
  city: string;
  state: string;
  zip: string;
}

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.scss',
})
export class UserTable implements OnInit {

  constructor(private userService: UserService) { }
  users = signal<User[]>([]);
  searchTerm = signal('');
  sortColumn = signal<keyof User>('first_name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  searchInput = '';
  itemsPerPage = 5;

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users.set(data);
    });
  }

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.users().filter(user =>
      user.first_name.toLowerCase().includes(term) ||
      user.last_name.toLowerCase().includes(term)
    );
  });
  applySearch() {
    const value = this.searchInput.trim();

    if (!value) {
      this.searchTerm.set('');
    } else {
      this.searchTerm.set(value);
    }

    this.currentPage.set(1);
  }
  sortedUsers = computed(() => {
    const column = this.sortColumn();
    const direction = this.sortDirection();

    return [...this.filteredUsers()].sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.sortedUsers().slice(start, start + this.itemsPerPage);
  });

  totalPages = computed(() =>
    Math.ceil(this.sortedUsers().length / this.itemsPerPage)
  );

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  sort(column: keyof User) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(
        this.sortDirection() === 'asc' ? 'desc' : 'asc'
      );
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }
  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });
  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }
}