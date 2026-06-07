import Share from 'react-native-share';
import RNFS from 'react-native-fs';

export const formatDate = isoString => {
  const date = new Date(isoString);

  const pad = n => (n < 10 ? '0' + n : n);

  const dd = pad(date.getDate());
  const mm = pad(date.getMonth() + 1);
  const yyyy = date.getFullYear();

  const HH = pad(date.getHours());
  const MM = pad(date.getMinutes());
  const SS = pad(date.getSeconds());

  return `${dd}-${mm}-${yyyy} ${HH}:${MM}:${SS}`;
};

export const shareImage = async (imageUrl, showMessage) => {
  try {
    if (!imageUrl) {
      return;
    }

    const fileName = `AI_Image_${Date.now()}.jpg`;
    const path = `${RNFS.CachesDirectoryPath}/${fileName}`;

    const download = RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: path,
    });

    const result = await download.promise;

    if (result.statusCode !== 200) {
      return;
    }
    await new Promise(res => setTimeout(res, 300));

    await Share.open({
      url: 'file://' + path,
      type: 'image/jpeg',
      failOnCancel: false,
      message: 'Check out this AI-generated image using AISerbisyosStudio App',
    });
  } catch (error) {
    showMessage(error.message, "error");
  }
};

export const downloadImage = async (imageUrl, showMessage) => {
  try {
    const fileName = `AI_Image_${Date.now()}.jpg`;
    const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    const download = RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: path,
    });

    const result = await download.promise;
    if (result.statusCode === 200) {
      showMessage('Image savd at ' + path, 'success');
    } else {
      showMessage('Failed to save image', 'error');
    }
  } catch (error) {
    showMessage(error.message, "error");
  }
};

export const getTimeAgo = createdAt => {
  const now = new Date();
  const created = new Date(createdAt);

  const diffMs = now - created;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return 'Just now';
  if (minutes < 60)
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;

  if (hours < 24)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  if (days < 7)
    return `${days} day${days > 1 ? 's' : ''} ago`;

  if (weeks < 4)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;

  if (months < 12)
    return `${months} month${months > 1 ? 's' : ''} ago`;

  return `${years} year${years > 1 ? 's' : ''} ago`;
};