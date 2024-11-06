import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ImageService {
  deleteFile = async (fileName: string) => {
    const filePath = join(__dirname, '..', '..', '..', 'uploads', fileName);

    fs.unlinkSync(filePath);
    return `successfully deleted ${fileName}`;
  };
}
