import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { Upload } from '../schema/upload';
import { BaseService } from './base-service';

type Photo = { name: string; type: string; uri: string };

@autoInjectable()
export class UploadsService extends BaseService<Upload> {
  constructor(@inject('ActContext') private _context?: ActContext) {
    super(_context, 'uploads');
  }

  insert = (photo: Photo | string) => {
    const { name, type, uri } = photo as Photo;
    const { endpoint, fullSizeUrl, thumbnailUrl, uploadPreset } =
      this._context.getCloudinaryConfig();
    const data = new FormData();
    data.append('file', {
      name,
      type,
      uri
    });
    data.append('upload_preset', uploadPreset);
    return fetch(endpoint, {
      method: 'POST',
      body: data,
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
