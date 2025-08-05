import checkerApi from '../api/checkeApi';

export const validateTask = async (taskName, repoUrl) => {
  const response = await checkerApi.post('/validate/', {
    task_name: taskName,
    repo_url: repoUrl,
  });
  return response.data;
};
