import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const calculateSize = (obj) => new Blob([JSON.stringify(obj || {})]).size;

const customFetch = async (uri, options) => {
  console.log("[GraphQL customFetch] Starting", uri);
  const startTime = new Date();
  const response = await fetch(uri, options);
  console.log("[GraphQL customFetch] fetch returned status:", response.status);
  
  // Clone to read the body without consuming the original stream
  const clone = response.clone();
  let data = {};
  try {
    data = await clone.json();
  } catch {
    data = {};
  }
  
  const timeMs = new Date() - startTime;
  const payloadSize = calculateSize(data);
  
  // Parse request body to get operation name
  const reqBody = JSON.parse(options.body);
  const operationName = reqBody.operationName || 'GraphQL Operation';
  const method = reqBody.query.trim().startsWith('mutation') ? 'MUTATION' : 'QUERY';

  // count fields (rough estimate based on first returned object)
  let fieldCount = 0;
  if (data.data) {
    const keys = Object.keys(data.data);
    if (keys.length > 0) {
      const firstResult = data.data[keys[0]];
      if (Array.isArray(firstResult) && firstResult.length > 0) {
        fieldCount = Object.keys(firstResult[0]).length;
      } else if (typeof firstResult === 'object' && firstResult !== null) {
        fieldCount = Object.keys(firstResult).length;
      }
    }
  }

  const rawRequest = `POST /graphql\n\n${reqBody.query.trim()}\n\nVariables:\n${JSON.stringify(reqBody.variables || {}, null, 2)}`;

  const event = new CustomEvent('API_REQUEST', {
    detail: {
      id: crypto.randomUUID(),
      originalReqId: options.headers ? options.headers['x-request-id'] : null,
      type: 'GRAPHQL',
      method,
      endpoint: `/graphql (${operationName})`,
      status: response.ok && !data.errors ? 'Success' : 'Failed',
      statusCode: response.status,
      timeMs,
      payloadSize,
      fieldCount,
      rawRequest,
      responseBody: data
    }
  });
  window.dispatchEvent(event);
  console.log("[GraphQL customFetch] returning response");

  return response;
};

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  fetch: customFetch
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export default client;
