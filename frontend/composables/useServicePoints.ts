export const useServicePoints = () => {
  const getAll = async () => $fetch('/api/v1/service-points');
  const getById = async (id: string) => $fetch(`/api/v1/service-points/${id}`);
  const create = async (data: any) => $fetch('/api/v1/service-points', { method: 'POST', body: data });
  const update = async (id: string, data: any) => $fetch(`/api/v1/service-points/${id}`, { method: 'PUT', body: data });
  const remove = async (id: string) => $fetch(`/api/v1/service-points/${id}`, { method: 'DELETE' });

  return { getAll, getById, create, update, remove };
};
