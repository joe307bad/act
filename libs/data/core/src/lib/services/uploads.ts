import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { Upload } from '../schema/upload';
import { BaseService } from './base-service';
import Rusha from 'rusha';

type Photo = { name: string; type: string; uri: string };

@autoInjectable()
export class UploadsService extends BaseService<Upload> {
  constructor(@inject('ActContext') private _context?: ActContext) {
    super(_context, 'uploads');
  }

  insert = async (photo: Photo | string) => {
    return new Promise<void>((resolve) => {
      this._db.write(async () => {
        const { name, type, uri } = photo as Photo;
        // const { endpoint, fullSizeUrl, thumbnailUrl, uploadPreset } =
        //   this._context.getCloudinaryConfig();
        const data = new FormData();
        console.log({ photo });
        // console.log({ endpoint, uploadPreset });
        // const timestamp = Date.now().toString();
        // data.append('file', {
        //   type,
        //   uri
        // } as any);
        // // data.append('timestamp', timestamp);
        // console.log({ timestamp });
        // data.append('api_key', '824634829234726');
        // const signature = Rusha.createHash()
        //   .update(
        //     `timestamp=${timestamp}&upload_preset=${uploadPreset}UAp9LFNKvwuIYZmMILpkZPEdVfo`
        //   )
        //   .digest('hex');
        // console.log({ signature });
        // // data.append('signature', signature);

        data.append('file', {
          type,
          uri,
          name: Math.random().toString()
        } as any);
        data.append('upload_preset', 'joebad.Mobile');
        return fetch(
          'https://api.cloudinary.com/v1_1/joebad-com/image/upload',
          {
            method: 'POST',
            body: data,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
          .then((res) => {
            console.log('upload success');
            if ((res as any).error) {
              console.error((res as any).error);
              return resolve();
            }
            return res.json();
          })
          .then((res) => {
            console.log(res);
            if (!res.public_id) {
              return;
            }
            return this._collection.create((m) => {
              m.name = res.public_id;
            });
          })
          .then(() => resolve())
          .catch((e) => {
            console.error(e);
          });
      });
    });
  };
}
