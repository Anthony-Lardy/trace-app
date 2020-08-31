import { Component, OnInit } from '@angular/core';
import { routes } from '../../consts/routes';
import { Student } from '@data/models/student.interface';
import { Observable } from 'rxjs';
import { StudentService } from '@data/services/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.scss']
})
export class StudentSidebarComponent implements OnInit {
  public routes: typeof routes = routes;
  public students: Observable<Student[]>;
  href: string;

  constructor(private studentService: StudentService, private router: Router) {
  }

  ngOnInit() {
    this.href = this.router.url;
    console.log(this.href);
    const str = this.href;
    const splitted = str.split('/');
    if (splitted[2].includes('CRS')){
      this.students = this.studentService.getStudents({
        filter: `courses:(${splitted[2]})`
      });
    }else{
      this.students = this.studentService.getStudents({
        filter: `groups:(${splitted[2]})`
      });
    }
  }
}
