export const usePatients = () => {
  const getAll = async () => $fetch('/api/v1/patients');
  const getById = async (id: string) => $fetch(`/api/v1/patients/${id}`);
  const create = async (data: any) => $fetch('/api/v1/patients', { method: 'POST', body: data });
  const update = async (id: string, data: any) => $fetch(`/api/v1/patients/${id}`, { method: 'PUT', body: data });
  const remove = async (id: string) => $fetch(`/api/v1/patients/${id}`, { method: 'DELETE' });

  return { getAll, getById, create, update, remove };
};
