import { Download } from 'api-types';

export interface DownloadAction {
  tooltip: string;
  action: (download: Download) => void;
  show: (download: Download) => boolean;
  icon: string;
  loading?: (download: Download) => boolean;
}

export class DownloadActionsConfig {
  static readonly STEP_INDEX_TO_LABEL = {
    0: $localize`Creating download`,
    1: $localize`Getting info`,
    2: $localize`Downloading file`,
    3: $localize`Complete`
  };

  static createActions(
    watchContent: (download: Download) => void,
    showError: (download: Download) => void,
    restartDownload: (download: Download) => void,
    pauseDownload: (download: Download) => void,
    resumeDownload: (download: Download) => void,
    cancelDownload: (download: Download) => void,
    clearDownload: (download: Download) => void
  ): DownloadAction[] {
    return [
      {
        tooltip: $localize`Watch content`,
        action: watchContent,
        show: (download: Download) => download.finished && !download.error,
        icon: 'smart_display'
      },
      {
        tooltip: $localize`Show error`,
        action: showError,
        show: (download: Download) => download.finished && !!download.error,
        icon: 'warning'
      },
      {
        tooltip: $localize`Restart`,
        action: restartDownload,
        show: (download: Download) => download.finished,
        icon: 'restart_alt'
      },
      {
        tooltip: $localize`Pause`,
        action: pauseDownload,
        show: (download: Download) => !download.finished && (!download.paused || !download.finished_step),
        icon: 'pause'
      },
      {
        tooltip: $localize`Resume`,
        action: resumeDownload,
        show: (download: Download) => !download.finished && download.paused && download.finished_step,
        icon: 'play_arrow'
      },
      {
        tooltip: $localize`Cancel`,
        action: cancelDownload,
        show: (download: Download) => !download.finished && !download.paused && !download.cancelled,
        icon: 'cancel'
      },
      {
        tooltip: $localize`Clear`,
        action: clearDownload,
        show: (download: Download) => download.finished || download.paused,
        icon: 'delete'
      }
    ];
  }
}