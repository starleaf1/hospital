export const useUsers = () => {
  const getAll = async () => $fetch('/api/v1/users');
  const getById = async (id: string) => $fetch(`/api/v1/users/${id}`);
  const create = async (data: any) => $fetch('/api/v1/users', { method: 'POST', body: data });
  const update = async (id: string, data: any) => $fetch(`/api/v1/users/${id}`, { method: 'PUT', body: data });
  const remove = async (id: string) => $fetch(`/api/v1/users/${id}`, { method: 'DELETE' });

  return { getAll, getById, create, update, remove };
};
