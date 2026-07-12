import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';
const API_URL = `${BASE_URL}/products`;

const calculateSize = (obj) => new Blob([JSON.stringify(obj || {})]).size;

const restInstance = axios.create();

restInstance.interceptors.request.use((config) => {
  console.log("[REST Request Interceptor] Starting", config.url);
  config.metadata = { startTime: new Date() };
  return config;
});

restInstance.interceptors.response.use(
  (response) => {
    console.log("[REST Response Interceptor] Success", response.config.url);
    const timeMs = new Date() - response.config.metadata.startTime;
    const payloadSize = calculateSize(response.data);
    
    let fieldCount = 0;
    if (Array.isArray(response.data) && response.data.length > 0) {
      fieldCount = Object.keys(response.data[0]).length;
    } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      fieldCount = Object.keys(response.data).length;
    }

    const endpointPath = response.config.url.replace('http://localhost:4000', '');
    const searchParams = new URLSearchParams(response.config.params).toString();
    const fullPath = searchParams ? `${endpointPath}?${searchParams}` : endpointPath;
    
    let rawRequest = `${response.config.method.toUpperCase()} ${fullPath}`;
    if (response.config.data) {
      rawRequest += `\n\n${JSON.stringify(JSON.parse(response.config.data), null, 2)}`;
    }

    const event = new CustomEvent('API_REQUEST', {
      detail: {
        id: crypto.randomUUID(),
        originalReqId: response.config.headers['x-request-id'] || null,
        type: 'REST',
        method: (response.config.method || 'UNKNOWN').toUpperCase(),
        endpoint: endpointPath.split('?')[0],
        status: 'Success',
        statusCode: response.status,
        timeMs,
        payloadSize,
        fieldCount,
        rawRequest,
        responseBody: response.data
      }
    });
    window.dispatchEvent(event);
    return response;
  },
  (error) => {
    console.error("[REST Response Interceptor] Error", error);
    const config = error.config ?? {};
    const start = config.metadata?.startTime ?? new Date();
    const timeMs = Date.now() - start.getTime();

    const endpointPath = config.url ? config.url.replace('http://localhost:4000', '') : '/api/products';
    
    let rawRequest = `${(config.method || 'UNKNOWN').toUpperCase()} ${endpointPath}`;
    if (config.data) {
      try {
        rawRequest += `\n\n${JSON.stringify(JSON.parse(config.data), null, 2)}`;
      } catch {
        rawRequest += `\n\n${config.data}`;
      }
    }

    const event = new CustomEvent('API_REQUEST', {
      detail: {
        id: crypto.randomUUID(),
        type: 'REST',
        method: (config.method || 'UNKNOWN').toUpperCase(),
        endpoint: endpointPath.split('?')[0],
        status: 'Failed',
        statusCode: error.response?.status || 500,
        timeMs,
        payloadSize: 0,
        fieldCount: 0,
        rawRequest,
        responseBody: { error: error.message }
      }
    });
    window.dispatchEvent(event);
    return Promise.reject(error);
  }
);

export const restApi = {
  getProducts: async (search = '', category = '', reqId = null) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    
    const headers = reqId ? { 'x-request-id': reqId } : {};
    
    const pRes = await restInstance.get('http://localhost:4000/api/products', { params, headers });
    
    // In a real REST app, we'd fetch categories from a separate endpoint to populate the dropdown
    const cRes = await restInstance.get('http://localhost:4000/api/categories', { headers });
    
    return {
      products: pRes.data.map(p => ({ ...p, id: p.id ?? p._id })),
      categories: ['All', ...cRes.data.map(c => c.name)] 
    };
  },

  getProductById: async (id, reqId = null) => {
    const headers = reqId ? { 'x-request-id': reqId } : {};
    const response = await restInstance.get(`http://localhost:4000/api/products/${id}`, { headers });
    return { ...response.data, id: response.data.id ?? response.data._id };
  },

  getCategoryById: async (id, reqId = null) => {
    if (!id) return null;
    const headers = reqId ? { 'x-request-id': reqId } : {};
    const response = await restInstance.get(`http://localhost:4000/api/categories/${id}`, { headers });
    return response.data;
  },

  getSupplierById: async (id, reqId = null) => {
    if (!id) return null;
    const headers = reqId ? { 'x-request-id': reqId } : {};
    const response = await restInstance.get(`http://localhost:4000/api/suppliers/${id}`, { headers });
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await restInstance.post(API_URL, productData);
    return response.data;
  },
  
  updateProduct: async (id, input) => {
    const response = await restInstance.put(`${API_URL}/${id}`, input);
    return response.data;
  },
  
  deleteProduct: async (id) => {
    const response = await restInstance.delete(`${API_URL}/${id}`);
    return true;
  },

  deleteAllProducts: async (reqId = null) => {
    const headers = reqId ? { 'x-request-id': reqId } : {};
    const response = await restInstance.delete('http://localhost:4000/api/products/bulk/delete', { headers });
    return response.data;
  },

  bulkInsertProducts: async (products, reqId = null) => {
    const headers = reqId ? { 'x-request-id': reqId } : {};
    const response = await restInstance.post('http://localhost:4000/api/products/bulk/insert', products, { headers });
    return response.data;
  }
};
