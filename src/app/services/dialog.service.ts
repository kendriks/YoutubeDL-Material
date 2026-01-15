import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SettingsComponent } from '../settings/settings.component';
import { AboutDialogComponent } from '../dialogs/about-dialog/about-dialog.component';
import { UserProfileDialogComponent } from '../dialogs/user-profile-dialog/user-profile-dialog.component';
import { SetDefaultAdminDialogComponent } from '../dialogs/set-default-admin-dialog/set-default-admin-dialog.component';
import { ArchiveViewerComponent } from '../components/archive-viewer/archive-viewer.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private readonly dialogWidth = {
    settings: '80vw',
    about: '80vw',
    profile: '60vw',
    archives: '85vw'
  };

  constructor(private dialog: MatDialog) {}

  openSettings(): MatDialogRef<SettingsComponent> {
    return this.dialog.open(SettingsComponent, {
      width: this.dialogWidth.settings
    });
  }

  openAbout(): MatDialogRef<AboutDialogComponent> {
    return this.dialog.open(AboutDialogComponent, {
      width: this.dialogWidth.about
    });
  }

  openProfile(): MatDialogRef<UserProfileDialogComponent> {
    return this.dialog.open(UserProfileDialogComponent, {
      width: this.dialogWidth.profile
    });
  }

  openArchives(): MatDialogRef<ArchiveViewerComponent> {
    return this.dialog.open(ArchiveViewerComponent, {
      width: this.dialogWidth.archives
    });
  }

  openSetDefaultAdmin(): MatDialogRef<SetDefaultAdminDialogComponent> {
    return this.dialog.open(SetDefaultAdminDialogComponent);
  }
}
