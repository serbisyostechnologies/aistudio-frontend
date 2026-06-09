import apiClient from './authInterceptor';

//User end points
export const resiger = async data => {
  return await apiClient.post('/users/register', data);
};

export const login = async data => {
  return await apiClient.post('/users/login', data);
};

export const logoutApi = async data => {
  return await apiClient.post('/users/logout', data);
};

export const uploadProfilePhotoApi = async data => {
  return await apiClient.post('/users/upload-profile-photo', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const removeProfilePhotoApi = async data => {
  return await apiClient.post('/users/remove-profile-photo', data);
};

export const updateDeviceIdentitiesApi = async data => {
  return await apiClient.post('/users/update-device-identities', data);
};

//Project image end points
export const createImage = async data => {
  return await apiClient.post('/projects/create-image-using-prompt', data);
};

export const getAllProjects = async data => {
  return await apiClient.post('/projects/get-all-by-user-id', data);
};

export const updateProjectLikeUnlike = async data => {
  return await apiClient.post('/projects/update-project-like', data);
};

export const deleteProjectById = async data => {
  return await apiClient.post('/projects/delete-project-by-id', data);
};

export const createCollage = async data => {
  return await apiClient.post('/projects/create-collage-using-prompt', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const editImage = async data => {
  return await apiClient.post('/projects/edit-image-using-prompt', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const analyseImage = async data => {
  return await apiClient.post('/projects/analyse-image-using-prompt', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

//Project video end points
export const createVideoUsingPrompt = async data => {
  return await apiClient.post('/projects/create-video-using-prompt', data);
};

export const createVideoUsingImages = async data => {
  return await apiClient.post('/projects/create-video-using-images', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};