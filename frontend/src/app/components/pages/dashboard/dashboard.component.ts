import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Food } from 'src/app/shared/models/Food';
import { Observable, catchError, tap } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { SharedService } from 'src/app/services/shared.service';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  showUpdateButton: boolean = false;

  //metarial table properties
  displayedColumns: string[] = ['id', 'name', 'favorite', 'origins', 'cookTime', 'price', 'image', 'action'];

  dataSource!: MatTableDataSource<any>;
  //for reaching dom element of paginator and sort template
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //data deposit for canexit() 
  
  private dialogformvalue: any = {}


  
  constructor(private sharedService: SharedService,private foodService: FoodService, public dialog: MatDialog, private api: ApiService, private toastr: ToastrService) {
    
    
   }

  ngOnInit(): void {
   
    this.getItem()
    
  }

  //opening dialog section for adding item
  openDialog() {
    this.dialog.open(DialogComponent, { width: "50%" }).afterClosed().subscribe((resp: string) => {
      this.dialogformvalue = resp
      //refreshing table after operation
      this.getItem()
    }
    )
    
  }
// getting data for table and setting interface values for metarial pagination and sorting 
getItem() {
  this.foodService.getList()
    .subscribe((res: any) => {
      
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    })
}
//readymade filter from metarial table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 //opening dialog section for editing item
  editItem(row: any) {
    console.log("bool çalışıyor")
    this.sharedService.showUpdateButton = true;
    this.dialog.open(DialogComponent, { width: '50%', data: row }).afterClosed().subscribe((resp: string) => {
     //getting close response from dialog for guard 
     this.showUpdateButton=true;
      this.dialogformvalue = resp
      //refreshing table after operation
      this.getItem()
    })
  }

  deleteItem(id: number) {
    console.log(2)
    //Confirmation dialog before delete operation
    const message = `Are you sure to delete this item?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.foodService.deleteItemApi(id).subscribe(res =>
          //refreshing table after operation
          this.getItem()
        )
      }
    });
  
  }


 
// guard method values came from dialog component close methods
  canExit(): boolean {
    if (this.dialogformvalue.touched && this.dialogformvalue.pristine || this.dialogformvalue.touched && this.dialogformvalue.invalid) {
      this.toastr.error('Unsaved Changes', 'Error')
      if (confirm("There are some unsaved changes")) {
        return true
      }
      return false
    }
    return true
  }

  // NG metarial dialog components automatically unsub. when closed
}



