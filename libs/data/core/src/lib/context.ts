import { DatabaseAdapter } from '@nozbe/watermelondb/adapters/type';
import Database from '@nozbe/watermelondb/Database';
import { singleton } from 'tsyringe';
import {
  Achievement,
  AchievementCategory,
  Community,
  Deleted,
  Event,
  User
} from './schema';
import { Checkin } from './schema/checkin';
import { CheckinAchievement } from './schema/checkin-achievement';
import { CheckinUser } from './schema/checkin-user';
import { Upload } from './schema/upload';

type CloudinaryConfig = {
  endpoint: string;
  uploadPreset: string;
  thumbnailUrl: string;
  fullSizeUrl: string;
};

@singleton()
export class ActContext {
  private _database: Database;
  private _actApiUrl?: string;
  private _cloudinaryConfig?: CloudinaryConfig;
  constructor(
    adapter: DatabaseAdapter,
    config?: { [key: string]: string }
  ) {
    this._database = new Database({
      adapter,
      modelClasses: [
        Community,
        Deleted,
        Event,
        Achievement,
        AchievementCategory,
        User,
        Checkin,
        CheckinAchievement,
        CheckinUser,
        Upload
      ],
      actionsEnabled: true
    });
    this._actApiUrl = config.ACT_API_URL;
    this._cloudinaryConfig = {
      endpoint: config.CLOUDINARY_ENDPOINT,
      uploadPreset: config.CLOUDINARY_UPLOAD_PRESET,
      thumbnailUrl: config.CLOUDINARY_THUMBNAIL_URL,
      fullSizeUrl: config.CLOUDINARY_FULL_SIZE_URL
    };
  }

  get() {
    return this._database;
  }

  getActApiUrl() {
    return this._actApiUrl ?? 'http://192.168.0.4:3333/api';
  }

  getCloudinaryConfig(): CloudinaryConfig {
    return this._cloudinaryConfig ?? ({} as CloudinaryConfig);
  }
}
