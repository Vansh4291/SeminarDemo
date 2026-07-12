import http from 'http';

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const time = Date.now() - start;
        const size = Buffer.byteLength(data, 'utf8');
        resolve({ time, size, status: res.statusCode });
      });
    });

    req.on('error', (e) => reject(e));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function benchmark(label) {
  console.log(`\n--- Benchmark: ${label} ---`);
  
  // REST /api/products
  const restOptions = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/products',
    method: 'GET'
  };
  
  const restRes = await makeRequest(restOptions);
  console.log(`REST Response Time: ${restRes.time}ms, Payload Size: ${(restRes.size / 1024).toFixed(2)} KB`);

  // GraphQL /graphql
  const graphqlData = JSON.stringify({
    query: `
      query GetProducts {
        products {
          id
          name
          description
          price
          category
          stock
          createdAt
          updatedAt
        }
      }
    `
  });
  
  const graphqlOptions = {
    hostname: 'localhost',
    port: 4000,
    path: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(graphqlData)
    }
  };
  
  const gqlRes = await makeRequest(graphqlOptions, graphqlData);
  console.log(`GraphQL Response Time: ${gqlRes.time}ms, Payload Size: ${(gqlRes.size / 1024).toFixed(2)} KB`);
}

benchmark(process.argv[2] || 'Default');
