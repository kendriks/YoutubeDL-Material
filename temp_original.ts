import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { Router } from '@angular/router';
import { DatabaseFile, FileType, FileTypeFilter, Sort, GetPlaylistsResponse, GetAllFilesResponse, Playlist } from '../../../api-types';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatChipListboxChange } from '@angular/material/chips';
import { MatSelectionListChange } from '@angular/material/list';
import { FileManagementService } from 'app/services/file-management.service';
import { FileFilterService } from 'app/services/file-filter.service';
import { FileSelectionService } from 'app/services/file-selection.service';

@Component({
  selector: 'app-recent-videos',
  templateUrl: './recent-videos.component.html',
  styleUrls: ['./recent-videos.component.scss']
})
export class RecentVideosComponent implements OnInit {
  @Input() config: RecentVideosConfig = { usePaginator: true, selectMode: false, sub_id: null, customHeader: null, selectedIndex: 1 };
  @Output() fileSelectionEmitter = new EventEmitter<{new_selection: string[], thumbnailURL: string}>();
  @ViewChild('paginator') paginator: MatPaginator;
  
  pageSize = 10;
  paged_data: DatabaseFile[] = null;
  selected_data: string[] = [];
  selected_data_objs: DatabaseFile[] = [];
  reverse_order = false;
  cached_file_count = 0;
  loading_files: number[] | null = null;
  normal_files_received = false;
  file_count = 10;
  searchChangedSubject: Subject<string> = new Subject<string>();
  downloading_content: Record<string, boolean> = {};
  search_mode = false;
  search_text = '';
  searchIsFocused = false;
  descendingMode = true;
  fileFilters: Record<string, {key: string; label: string; incompatible?: string[]}> = {
    video_only: { key: 'video_only', label: $localize`Video only`, incompatible: ['audio_only'] },
    audio_only: { key: 'audio_only', label: $localize`Audio only`, incompatible: ['video_only'] },
    favorited: { key: 'favorited', label: $localize`Favorited` }
  };
  selectedFilters: string[] = [];
  sortProperty = 'registered';
  playlists: Playlist[] | null = null;

  constructor(
    public postsService: PostsService,
    private router: Router,
    private fileManagementService: FileManagementService,
    private fileFilterService: FileFilterService,
    private fileSelectionService: FileSelectionService
  ) {
    const sub_id_appendix = this.sub_id ? `_${this.sub_id}` : '';
    const cached = localStorage.getItem(`cached_file_count${sub_id_appendix}`);
    if (cached) { this.cached_file_count = Math.min(+cached, 10); this.loading_files = Array(this.cached_file_count).fill(0); }
    const cached_sort = localStorage.getItem('sort_property');
    if (cached_sort) this.sortProperty = cached_sort;
    const cached_filter = localStorage.getItem('file_filter');
    this.selectedFilters = (this.config.usePaginator && cached_filter) ? JSON.parse(cached_filter) : [];
    const sort_order = localStorage.getItem('recent_videos_sort_order');
    if (sort_order) this.descendingMode = sort_order === 'descending';
    const order_reversed = localStorage.getItem('default_playlist_order_reversed');
    if (order_reversed) this.reverse_order = order_reversed === 'true';
  }

  get usePaginator(): boolean { return this.config.usePaginator; }
  get sub_id(): string | null { return this.config.sub_id; }
  get defaultSelected(): DatabaseFile[] { return []; }

  ngOnInit(): void {
    if (this.sub_id) { delete this.fileFilters['audio_only']; delete this.fileFilters['video_only']; }
    if (this.postsService.initialized) { this.getAllFiles(); this.getAllPlaylists(); }
    else this.postsService.service_initialized.subscribe(init => { if (init) { this.getAllFiles(); this.getAllPlaylists(); } });
    this.postsService.files_changed.subscribe(changed => { if (changed) this.getAllFiles(); });
    this.postsService.playlists_changed.subscribe(changed => { if (changed) this.getAllPlaylists(); });
    this.selected_data = this.defaultSelected.map(file => file.uid);
    this.selected_data_objs = this.defaultSelected;
    this.searchChangedSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(model => { this.search_mode = model.length > 0; this.getAllFiles(); });
  }

  getAllPlaylists(): void { this.postsService.getPlaylists().subscribe((res: GetPlaylistsResponse) => { this.playlists = res['playlists']; }); }
  onSearchInputChanged(newvalue: string): void { this.normal_files_received = false; this.searchChangedSubject.next(newvalue); }

  sortOptionChanged(value: Sort): void {
    localStorage.setItem('sort_property', value['by']);
    localStorage.setItem('recent_videos_sort_order', value['order'] === -1 ? 'descending' : 'ascending');
    this.descendingMode = value['order'] === -1;
    this.sortProperty = value['by'];
    this.getAllFiles();
  }
this.fileFilterService.getFilterKey(event.value, this.selectedFilters);
      this.selectedFilters = this.fileFilterService.removeIncompatibleFilters(
        this.selectedFilters,
        filter_key,
        this.fileFilters
      );
      this.selectedFilters.push(filter_key);
    } else {
      this.selectedFilters = event.value;
    }Change): void {
    if (event.value.length === this.selectedFilters.length) return;
    if (event.value.length > this.selectedFilters.length) {
      const filter_key = event.value.filter(k => !this.selectedFilters.includes(k))[0];
      this.selectedFilters = this.selectedFilters.filter(f => !this.fileFilters[f].incompatible || !this.fileFilters[f].incompatible.includes(filter_key));
      this.selecfileFilterService.getFileTypeFilter(this.selectedFilters);
  }

  getFavoriteFilter(): boolean {
    return this.fileFilterService.getFavoriteFilter(this.selectedFilters);
 

  getFileTypeFilter(): FileTypeFilter {
    return this.selectedFilters.includes('audio_only') ? 'audio_only' : this.selectedFilters.includes('video_only') ? 'video_only' : 'both';
  }

  getFavoriteFilter(): boolean { return this.selectedFilters.includes('favorited'); }

  getAllFiles(cache_mode = false): void {
    this.normal_files_received = cache_mode;
    const current_file_index = (this.paginator?.pageIndex || 0) * this.pageSize;
    const sort = { by: this.sortProperty, order: this.descendingMode ? -1 : 1 };
    const range = this.usePaginator ? [current_file_index, current_file_index + this.pageSize] : null;
    this.postsService.getAllFiles(sort, range, this.search_mode ? this.search_text : null, this.getFileTypeFilter(), this.getFavoriteFilter(), this.sub_id).subscribe((res: GetAllFilesResponse) => {
      this.file_count = res['file_count'];
      this.paged_data = res['files'];
      this.paged_data.forEach((file: DatabaseFile) => { if (typeof file.duration === 'string') file.duration = this.durationStringToNumber(file.duration); });
      localStorage.setItem('cached_file_count', '' + this.file_count);
      this.normal_files_received = true;
    });
  }

  goToFile(info_obj: {file: DatabaseFile; event: MouseEvent}): void {
    const file = info_obj['file'];
    this.postsService.config['Extra']['download_only_mode'] ? this.downloadFile(file) : this.navigateToFile(file, info_obj['event'].ctrlKey);
  }

  navigateToFile(file: DatabaseFile, new_tab: boolean): void {
    localStorage.setItem('player_navigator', this.router.url);
    const type = file.isAudio ? 'audio' : 'video';
    if (file.sub_id) !new_tab ? this.router.navigate(['/player', { uid: file.uid, type }]) : window.open(`/#/player;uid=${file.uid};type=${type}`);
    else !new_tab ? this.router.navigate(['/player', { type, uid: file.uid }]) : window.open(`/#/player;type=${type};uid=${file.uid}`);
  }

  goToSubscription(file: DatabaseFile): void { this.router.navigate(['/subscription', { id: file.sub_id }]); }

  downloadFile(file: DatabaseFile): void {
    this.fileManagementService.downloadFile(file);
  }

  deleteFile(args: {file: DatabaseFile; blacklistMode: boolean}): void {
    const file = args.file;
    file.sub_id ? this.deleteSubscriptionFile(file, args.blacklistMode) : this.deleteNormalFile(file, args.blacklistMode);
  }

  deleteNormalFile(file: DatabaseFile, blacklistMode = false): void {
    this.fileManagementService.deleteNormalFile(file, blacklistMode);
    this.removeFileCard(file);
  }

  deleteSubscriptionFile(file: DatabaseFile, blacklistMode = false): void {
    this.fileManagementService.deleteSubscriptionFile(file, blacklistMode);
    this.removeFileCard(file);
  }

  removeFileCard(file_to_remove: DatabaseFile): void {
    const index = this.paged_data.findIndex((f: DatabaseFile) => f.uid === file_to_remove.uid);
    if (index !== -1) this.paged_data.splice(index, 1);
    this.getAllFiles(true);
  }

  addFileToPlaylist(info_obj: {file: DatabaseFile; playlist_id: string}): void {
    const file = info_obj['file'], playlist_id = info_obj['playlist_id'];
    const playlist = this.playlists.find((p: Playlist) => p['id'] === playlist_id);
    this.postsService.addFileToPlaylist(playlist_id, file['uid']).subscribe((res: {success: boolean}) => {
      this.postsService.openSnackBar(res['success'] ? `Successfully added ${file.title} to ${playlist.name}!` : `Failed to add ${file.title} to ${playlist.name}!`);
      if (res['success']) this.postsService.playlists_changed.next(true);
    }, () => this.postsService.openSnackBar(`Failed to add ${file.title} to ${playlist.name}!`));
  }

  durationStringT
      this.fileSelectionService.addToSelection(this.selected_data, this.selected_data_objs, value);
    } else {
      this.fileSelectionService.removeFromSelection(this.selected_data, this.selected_data_objs, value.uid);
   
  }

  pageChangeEvent(event: PageEvent): void { this.pageSize = event.pageSize; this.loading_files = Array(this.pageSize).fill(0); this.getAllFiles(); }
this.fileSelectionService.reorderSelection(
      this.selected_data,
      this.selected_data_objs,
      event.previousIndex,
      event.currentIndex,
      this.reverse_order
    
    if (adding) { this.selected_data.push(value.uid); this.selected_data_objs.push(value); }
    else { this.selected_data = this.selected_data.filter((e: string) => e !== value.uid); this.selected_data_objs = this.selected_data_objs.filter((e: DatabaseFile) => e.uid !== value.uid); }
    this.fileSelectionService.removeSelectedFile(
      this.selected_data,
      this.selected_data_objs,
      index,
      this.reverse_order
    
  toggleSelectionOrder(): void { this.reverse_order = !this.reverse_order; localStorage.setItem('default_playlist_order_reversed', '' + this.reverse_order); }

  drop(event: CdkDragDrop<string>): void {
    if (this.reverse_order) { event.previousIndex = this.selected_data.length - 1 - event.previousIndex; event.currentIndex = this.selected_data.length - 1 - event.currentIndex; }
    moveItemInArray(this.selected_data, event.previousIndex, event.currentIndex);
    moveItemInArray(this.selected_data_objs, event.previousIndex, event.currentIndex);
    this.fileSelectionEmitter.emit({ new_selection: this.selected_data, thumbnailURL: this.selected_data_objs[0].thumbnailURL });
  }

  removeSelectedFile(index: number): void {
    if (this.reverse_order) index = this.selected_data.length - 1 - index;
    this.selected_data.splice(index, 1);
    this.selected_data_objs.splice(index, 1);
    this.fileSelectionEmitter.emit({ new_selection: this.selected_data, thumbnailURL: this.selected_data_objs[0]?.thumbnailURL });
  }

  toggleFavorite(file_obj: DatabaseFile): void { file_obj.favorite = !file_obj.favorite; this.postsService.updateFile(file_obj.uid, { favorite: file_obj.favorite }).subscribe(() => {}); }
  originalOrder = (): number => 0;
}
