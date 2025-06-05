import download from 'image-downloader';
import mime from 'mime-types';

export const downloadImage = async (link, dest) => {
  const extension = mime.extension(link);
  const filename = `${Date.now()}.${extension}`;
  // Example: 2023-10-01T12-34-56.789Z.jpg

  options = {
    url: link, // URL of the image to download
    dest: `${dest}${filename}`, // will be saved to /path/to/dest/photo.jpg
  };

  try {
    await download.image(options);

    console.log('Saved to', filename); // saved to /path/to/dest/photo.jpg
  } catch (error) {
    console.error('Download failed:', error);
  }
};
