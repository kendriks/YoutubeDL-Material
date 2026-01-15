import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { registerLocaleData, CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PostsService } from 'app/posts.services';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AvatarModule } from 'ngx-avatars';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { H401Interceptor } from './http.interceptor';

import es from '@angular/common/locales/es';

import {
  MainComponent, PlayerComponent, InputDialogComponent, CreatePlaylistComponent,
  SubscriptionsComponent, SubscribeDialogComponent, SubscriptionComponent,
  SubscriptionInfoDialogComponent, SettingsComponent, AboutDialogComponent,
  VideoInfoDialogComponent, ArgModifierDialogComponent, HighlightPipe,
  UpdaterComponent, UpdateProgressDialogComponent, ShareMediaDialogComponent,
  LoginComponent, DownloadsComponent, UserProfileDialogComponent,
  SetDefaultAdminDialogComponent, ModifyUsersComponent, AddUserDialogComponent,
  ManageUserComponent, ManageRoleComponent, CookiesUploaderDialogComponent,
  LogsViewerComponent, ConfirmDialogComponent, UnifiedFileCardComponent,
  RecentVideosComponent, EditSubscriptionDialogComponent, CustomPlaylistsComponent,
  EditCategoryDialogComponent, TwitchChatComponent, LinkifyPipe, SeeMoreComponent,
  ConcurrentStreamComponent, SkipAdButtonComponent, TasksComponent,
  UpdateTaskScheduleDialogComponent, RestoreDbDialogComponent, NotificationsComponent,
  NotificationsListComponent, TaskSettingsComponent, GenerateRssUrlComponent,
  SortPropertyComponent, OnlyNumberDirective, ArchiveViewerComponent,
  SubscriptionListComponent, SubscriptionHeaderComponent, SubscriptionActionsComponent,
  VideoInfoFieldsComponent, VideoInfoDisplayComponent, SubscribeBasicFormComponent,
  SubscribeAdvancedFormComponent
} from './declarations';

import {
  SubscriptionStateService, SubscriptionActionsService, SubscriptionUiService,
  VideoInfoDataService, VideoInfoStateService, SubscribeDataService, SubscribeFormService
} from './service-exports';

registerLocaleData(es, 'es');

@NgModule({
    declarations: [
        AppComponent, MainComponent, PlayerComponent, InputDialogComponent,
        CreatePlaylistComponent, SubscriptionsComponent, SubscribeDialogComponent,
        SubscriptionComponent, SubscriptionInfoDialogComponent, SettingsComponent,
        AboutDialogComponent, VideoInfoDialogComponent, ArgModifierDialogComponent,
        HighlightPipe, LinkifyPipe, UpdaterComponent, UpdateProgressDialogComponent,
        ShareMediaDialogComponent, LoginComponent, DownloadsComponent,
        UserProfileDialogComponent, SetDefaultAdminDialogComponent, ModifyUsersComponent,
        AddUserDialogComponent, ManageUserComponent, ManageRoleComponent,
        CookiesUploaderDialogComponent, LogsViewerComponent, ConfirmDialogComponent,
        UnifiedFileCardComponent, RecentVideosComponent, EditSubscriptionDialogComponent,
        CustomPlaylistsComponent, EditCategoryDialogComponent, TwitchChatComponent,
        SeeMoreComponent, ConcurrentStreamComponent, SkipAdButtonComponent, TasksComponent,
        UpdateTaskScheduleDialogComponent, RestoreDbDialogComponent, NotificationsComponent,
        NotificationsListComponent, TaskSettingsComponent, GenerateRssUrlComponent,
        SortPropertyComponent, OnlyNumberDirective, ArchiveViewerComponent,
        SubscriptionListComponent, VideoInfoFieldsComponent, VideoInfoDisplayComponent,
        SubscribeBasicFormComponent, SubscribeAdvancedFormComponent, SubscriptionHeaderComponent,
        SubscriptionActionsComponent
    ],
    imports: [
        CommonModule, BrowserModule, BrowserAnimationsModule, MatNativeDateModule, MatRadioModule,
        FormsModule, MatInputModule, MatSelectModule, ReactiveFormsModule, HttpClientModule,
        MatToolbarModule, MatCardModule, MatSnackBarModule, MatButtonModule, MatCheckboxModule,
        MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatExpansionModule,
        MatProgressBarModule, MatProgressSpinnerModule, MatButtonToggleModule, MatRippleModule,
        MatMenuModule, MatDialogModule, MatSlideToggleModule, MatAutocompleteModule, MatTabsModule,
        MatTooltipModule, MatPaginatorModule, MatSortModule, MatTableModule, MatDatepickerModule,
        MatChipsModule, MatBadgeModule, DragDropModule, ClipboardModule, TextFieldModule,
        ScrollingModule, NgxFileDropModule, AvatarModule, ContentLoaderModule, VgCoreModule,
        VgControlsModule, VgOverlayPlayModule, VgBufferingModule, RouterModule, AppRoutingModule
    ],
    providers: [
        PostsService, { provide: HTTP_INTERCEPTORS, useClass: H401Interceptor, multi: true },
        DatePipe, SubscriptionStateService, SubscriptionActionsService, SubscriptionUiService,
        VideoInfoDataService, VideoInfoStateService, SubscribeDataService, SubscribeFormService
    ],
    exports: [ HighlightPipe, LinkifyPipe ],
    bootstrap: [AppComponent]
})
export class AppModule { }
