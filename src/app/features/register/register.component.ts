import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
registerForm:FormGroup =new FormGroup({
  name: new FormControl("",[Validators.required,Validators.minLength(3)]),
  username: new FormControl(""),
  email: new FormControl("",[Validators.required,Validators.email]),
  dateOfBirth: new FormControl("",[Validators.required]),
  gender: new FormControl("Male",[Validators.required]),
  password: new FormControl("",[Validators.required,Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
  rePassword: new FormControl("",[Validators.required])
});

submitForm():void{
  console.log(this.registerForm);

}
}
