import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.userService.currentUser;

    if (currentUser && currentUser.isAdmin) {
      this.toastr.success('Admin sayfasına başarıyla erişildi!', 'Başarılı');
      // Kullanıcı admin yetkisine sahip, sayfaya erişime izin ver
      return true;
    } else {
      // Kullanıcı admin yetkisine sahip değil, belirlediğimiz sayfaya yönlendir ve toastr ile hata mesajı göster
      this.toastr.error('Bu sayfaya erişim izniniz yok!', 'Yetkisiz Erişim');
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
