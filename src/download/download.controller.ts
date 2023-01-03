import { Controller, Get, Body, Res } from '@nestjs/common';
import { DownloadService } from './download.service';
import { Response } from 'express';
import { DownloadDto } from './dto';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}
  // TODO: url sanitization (length, domain: yt & fb only), also move checks to the dto with some kind of middleware

  @Get('video')
  async downloadVideo(@Body() dto: DownloadDto, @Res() response: Response) {
    // if (dto.id.includes('list=') || dto.id.includes('playlist?')) {
    //// TODO: redirect to download playlist maybe ?

    //   throw new HttpException(
    //     'The video cannot be a playlist. Use /download/playlist instead',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    //let videoInfo = await this.downloadService.downloadVideoMP4(dto.id);
    //console.log(videoInfo);

    await this.downloadService.downloadVideo(dto, response);
  }

  @Get('playlist/video')
  async downloadVideoPlaylist(
    @Body() dto: DownloadDto,
    @Res() response: Response,
  ) {
    await this.downloadService.downloadVideoPlaylist(dto, response);
  }

  @Get('audio')
  async downloadAudio(@Body() dto: DownloadDto, @Res() response: Response) {
    await this.downloadService.downloadAudio(dto, response);
  }

  @Get('playlist/audio')
  async downloadAudioPlaylist(
    @Body() dto: DownloadDto,
    @Res() response: Response,
  ) {
    await this.downloadService.downloadAudioPlaylist(dto, response);
  }

  // TODO: downloads from other sites: facebook
}
