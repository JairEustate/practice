import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SidebarService } from '../sidebar/sidebar.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  public userName: string = 'BIENVENIDO';

  constructor(private _sidebar: SidebarService, private _dialog: MatDialog) {}

  public ngOnInit(): void {
    if (localStorage.getItem('UserName') !== null) {
      const userName: string = localStorage.getItem('UserName')!;
      this.userName = userName.length > 20 ? `${userName.slice(0, 20)}...` : userName;
    }
  }

  public toggle(): void {
    this._sidebar.toggle();
  }

  public onLogout(): void {
    const dialog = this._dialog.open(Logout, {
      width: '250px',
      data: {
        title: '¿seguro(a)?',
        content: '¿realmente deseas cerrar la sesión?',
        type: 'confirm',
      },
    });
    dialog.afterClosed().subscribe(data => {
      if (data) {
        localStorage.removeItem('UserName');
        localStorage.removeItem('AuthToken');
        localStorage.removeItem('ContextName');
        window.location.reload();
      }
    });
  }
}

@Component({
  selector: 'app-logout',
  templateUrl: './logout.template.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logout {
  constructor(
    private _dialogRef: MatDialogRef<Logout>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public onCancel(): void {
    this._dialogRef.close(false);
  }

  public onConfirm(): void {
    this._dialogRef.close(true);
  }
}
