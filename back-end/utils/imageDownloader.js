import download from 'image-downloader';
import mime from 'mime-types';

export const downloadImage = async (link, dest) => {
  const mimeType = mime.lookup(link);
  const contentType = mime.contentType(mimeType);
  const extension = mime.extension(contentType);

  const filename = `${Date.now()}.${extension}`;
  const fullPath = `${dest}${filename}`;

  try {
    const options = {
      url: link,
      dest: fullPath,
    };

    // console.log('Downloading image from:', link);

    await download.image(options);

    return filename;

    // console.log('Saved to', filename); // saved to /path/to/dest/photo.jpg
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};
// Example usage:https://s2-casaejardim.glbimg.com/I7oKmnkNdOG-6aQdwPxeawqUP5Q=/0x0:1200x1800/1000x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2023/4/P/aqhIEdTByhfLB4lWh2AA/01-estar-img-7482-1.jpg

/* 
{ 
 "link": "https://s2-casaejardim.glbimg.com/I7oKmnkNdOG-6aQdwPxeawqUP5Q=/0x0:1200x1800/1000x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2023/4/P/aqhIEdTByhfLB4lWh2AA/01-estar-img-7482-1.jpg"	
}
*/
