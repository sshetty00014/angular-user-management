import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../../models/user.model";

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://d2k-static-assets.s3.ap-south-1.amazonaws.com/assignment-files/python-backend-assignment/users.json';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}