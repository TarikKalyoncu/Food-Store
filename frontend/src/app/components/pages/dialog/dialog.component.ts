import { Component, Inject, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Food } from 'src/app/shared/models/Food';
import { FoodService } from 'src/app/services/food.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  public formValue!: FormGroup;
  //for showing update or add button depends on situation
  public actionButton: string = 'Add';
  public showUpdateButton: boolean = false;
  //Angular dialog metarial working like modal but more complex and efficent
  //Dashboard dialog actions handling with mat-dialog-ref
  //Data transfered with mat-dialog-data taking data from table(dashboard component)
  constructor(
    private sharedService: SharedService,
    private foodService: FoodService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<DialogComponent>,

    @Inject(MAT_DIALOG_DATA) public row: Food
  ) {}

  //validators for dialog form
  ngOnInit(): void {
    if (this.sharedService.showUpdateButton) {
      this.showUpdateButton = true;
    }

    this.formValue = this.formBuilder.group({
      name: ['', Validators.required],
      tags: ['', Validators.required],
      favorite: ['', Validators.required],
      cookTime: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
      origins: ['', Validators.required],
      price: ['', Validators.required],
      imageUrl: [''], // Yeni form alanı: imageUrl
    });
    //setting formvalues for updating action
    if (this.row) {
      this.actionButton = 'Update';
      this.formValue.controls['name'].setValue(this.row.name);
      this.formValue.controls['tags'].setValue(this.row.tags);
      this.formValue.controls['favorite'].setValue(this.row.favorite);
      this.formValue.controls['cookTime'].setValue(this.row.cookTime);
      this.formValue.controls['origins'].setValue(this.row.origins);
      this.formValue.controls['price'].setValue(this.row.price);
      this.formValue.controls['imageUrl'].setValue(this.row.imageUrl);
    }
  }

  postItem() {
    if (this.formValue.invalid) return;

    const fv = this.formValue.value;
    const food: Food = {
      name: fv.name,
      tags: fv.tags,
      favorite: fv.favorite,
      cookTime: fv.cookTime,
      origins: fv.origins,
      price: fv.price,
      imageUrl: fv.imageUrl,
      id: fv.name, // id boş bırakılmalı, çünkü yeni bir ürün eklenecek
    };

    this.foodService.postItemApi(food).subscribe((res: any) => {
      this.formValue.reset();
      this.toastr.success('Product Added', 'Success');
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Burada seçilen dosyayı kullanarak API'ye yükleme isteği gönderebilirsiniz
      // ve ardından bu isteğin sonucunda gelen dosya URL'sini "imageUrl" form alanını güncellemek için kullanabilirsiniz.
      const formData = new FormData();
      formData.append('file', file);

      this.foodService.uploadImage(formData).subscribe(
        (response: any) => {
          // Yükleme başarılı ise response içinde gelen dosya URL'sini "imageUrl" form alanına ata
          this.formValue.patchValue({ imageUrl: response.imageUrl });
        },
        (error: any) => {
          console.error('Error while uploading image:', error);
          // Yükleme sırasında hata durumu
        }
      );
    }
  }

  // if you click update return update action else posting item to db with form value

  //updating item to db with form value and row.id(which they picked with button)
  updateItem() {
    if (this.formValue.invalid) return;

    const fv = this.formValue.value;
    const food: Food = {
      name: fv.name,
      tags: fv.tags,
      favorite: fv.favorite,
      cookTime: fv.cookTime,
      origins: fv.origins,
      price: fv.price,
      imageUrl: fv.imageUrl,
      id: this.row.id, // Güncellenecek ürünün ID'sini formdan alın veya başka bir şekilde belirleyin
    };

    this.foodService.updateItemApi(food).subscribe((res: any) => {
      this.formValue.reset();
      this.toastr.success('Product Updated', 'Success');
    });
  }

  close() {
    //sending form data with close action so dashboard and guard can use
    this.dialogRef.close(this.formValue);
  }
  //Error handling for formvalidation  at template
  public errorHandling = (control: string, error: string) => {
    return this.formValue.controls[control].hasError(error);
  };
}
