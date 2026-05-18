export const useEncounters = () => {
  const getAll = async () => $fetch('/api/v1/encounters');
  const getById = async (id: string) => $fetch(`/api/v1/encounters/${id}`);
  const create = async (data: any) => $fetch('/api/v1/encounters', { method: 'POST', body: data });
  const update = async (id: string, data: any) => $fetch(`/api/v1/encounters/${id}`, { method: 'PUT', body: data });
  const remove = async (id: string) => $fetch(`/api/v1/encounters/${id}`, { method: 'DELETE' });

  return { getAll, getById, create, update, remove };
};
