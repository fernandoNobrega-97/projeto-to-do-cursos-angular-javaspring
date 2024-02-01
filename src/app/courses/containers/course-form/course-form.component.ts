import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CoursesService } from '../../services/courses.service';
import { Course } from '../../model/course';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-form',
  standalone: false,
  // imports: [],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss'
})
export class CourseFormComponent implements OnInit {

  form = this.formBuilder.group({
    _id: [''],
    name: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
    category: ['', [Validators.required]]
  })

  constructor(private formBuilder: NonNullableFormBuilder,
              private service: CoursesService,
              private snackBar: MatSnackBar,
              private location: Location,
              private route: ActivatedRoute) {
    // FormBuilder vai fazer por baixo do pano os Controls, new FormControl(''). Uma versão simplificada para nós utilizarmos.
    // this.form = formBuilder.group({
    //   name: [null],
    //   category: [null],
    // })
   }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    // Vou estar fazendo uma cópia da minha rota atual, ativa. E com o objeto data, consigo estar utilizando o Resolver: que dei o nome de 'course'.
    this.form.setValue({
      _id: course._id,
      name: course.name,
      category: course.category
    });
  }

  onSubmit() {
    this.service.save(this.form.value)
      .subscribe({ next: () => this.onSuccess(),
        error: () => this.onError()
      });
  }

  onCancel() {
    this.location.back();
  }

  private onSuccess() {
    this.snackBar.open('Curso salvo com sucesso!', '', { duration: 5000 });
    this.onCancel();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar curso!', '', { duration: 5000 });
  }

  getErrorMessage(fieldName: string) {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (field?.hasError('minlength')) {
      const requiredLength: number = field.errors ? field.errors['minlength']['requiredLength'] : 3;
      return `Precisa passar no mínimo ${requiredLength} caracteres.`;
    }
    if (field?.hasError('maxlength')) {
      const requiredLength: number = field.errors ? field.errors['maxlength']['requiredLength'] : 100;
      return `Tamanho máximo excedido de ${requiredLength} caracteres.`;
    }
    return 'Campo inválido';
  }
}
