import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { lookup } from 'mime-types';
import { tmpdir } from 'os';
import { join } from 'path';

import { DownloadDto } from './dto';

import { YtDlpHelper, YtDlpError } from 'yt-dlp-helper';
import { ZipHelper } from 'zip-helper';

const videoDir = join(tmpdir(), 'yt-dl-back', 'video');
const audioDir = join(tmpdir(), 'yt-dl-back', 'audio');
const ytHelper = new YtDlpHelper();
const zipHelper = new ZipHelper();

@Injectable()
export class DownloadService {
  async downloadVideo(dto: DownloadDto, response: Response): Promise<void> {
    try {
      const info = await ytHelper.downloadVideo(dto.id, videoDir, dto.wantMPEG);

      // TODO: handle info.error
      response.set({
        'Content-Type': lookup(info.ext),
        'Content-Disposition': `attachment; filename="${encodeURIComponent(
          info.title,
        )}.${info.ext}"`,
      });

      createReadStream(join(videoDir, `${info.id}.${info.ext}`)).pipe(response);
    } catch (e) {
      if (e instanceof YtDlpError) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      } else if (e instanceof Error) {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async downloadVideoPlaylist(
    dto: DownloadDto,
    response: Response,
  ): Promise<void> {
    try {
      const infos = await ytHelper.downloadVideoPlaylist(
        dto.id,
        videoDir,
        dto.wantMPEG,
      );

      const entries = new Map<string, string>();

      for (const info of infos) {
        if (info.error == null) {
          entries.set(
            join(videoDir, `${info.id}.${info.ext}`),
            `${info.title}.${info.ext}`,
          );
        }
      }

      response.set({
        'Content-Type': lookup('zip'),
        'Content-Disposition': `attachment; filename="${encodeURIComponent(
          infos[0].playlist,
        )}.zip"`,
      });

      const stream = await zipHelper.zipFiles(entries);
      stream.pipe(response);
    } catch (e) {
      if (e instanceof YtDlpError) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      } else if (e instanceof Error) {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  async downloadAudio(dto: DownloadDto, response: Response): Promise<void> {
    try {
      const info = await ytHelper.downloadAudio(dto.id, audioDir, dto.wantMPEG);

      // TODO: handle info.error
      response.set({
        'Content-Type': lookup(info.ext),
        'Content-Disposition': `attachment; filename="${encodeURIComponent(
          info.title,
        )}.${info.ext}"`,
      });

      createReadStream(join(audioDir, `${info.id}.${info.ext}`)).pipe(response);
    } catch (e) {
      if (e instanceof YtDlpError) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      } else if (e instanceof Error) {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async downloadAudioPlaylist(
    dto: DownloadDto,
    response: Response,
  ): Promise<void> {
    try {
      const infos = await ytHelper.downloadAudioPlaylist(
        dto.id,
        audioDir,
        dto.wantMPEG,
        3,
      );

      const entries = new Map<string, string>();

      for (const info of infos) {
        if (info.error == null) {
          entries.set(
            join(audioDir, `${info.id}.${info.ext}`),
            `${info.title}.${info.ext}`,
          );
        }
      }

      response.set({
        'Content-Type': lookup('zip'),
        'Content-Disposition': `attachment; filename="${encodeURIComponent(
          infos[0].playlist,
        )}.zip"`,
      });

      const stream = await zipHelper.zipFiles(entries);
      stream.pipe(response);
    } catch (e) {
      if (e instanceof YtDlpError) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      } else if (e instanceof Error) {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
