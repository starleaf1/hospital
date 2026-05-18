export const useTenants = () => {
  const getAll = async () => $fetch('/api/v1/tenants');
  const getById = async (id: string) => $fetch(`/api/v1/tenants/${id}`);
  const create = async (data: any) => $fetch('/api/v1/tenants', { method: 'POST', body: data });
  const update = async (id: string, data: any) => $fetch(`/api/v1/tenants/${id}`, { method: 'PUT', body: data });
  const remove = async (id: string) => $fetch(`/api/v1/tenants/${id}`, { method: 'DELETE' });

  return { getAll, getById, create, update, remove };
};
