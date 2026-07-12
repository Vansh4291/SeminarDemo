const { test, expect } = require('@playwright/test');

function calculateStats(times) {
  if (times.length === 0) return null;
  times.sort((a, b) => a - b);
  const min = times[0];
  const max = times[times.length - 1];
  const average = times.reduce((a, b) => a + b, 0) / times.length;
  const median = times[Math.floor(times.length / 2)];
  const p95 = times[Math.floor(times.length * 0.95)];
  return { min, max, average, median, p95 };
}

test.describe('API Performance Benchmarking', () => {
  test('Benchmark REST vs GraphQL /products', async ({ request }) => {
    test.setTimeout(60000); // Allow time for multiple requests
    const ITERATIONS = 10;
    const restTimes = [];
    const gqlTimes = [];

    // REST Benchmarks
    for (let i = 0; i < ITERATIONS; i++) {
      const start = Date.now();
      const res = await request.get('http://localhost:4000/api/products');
      expect(res.ok()).toBeTruthy();
      restTimes.push(Date.now() - start);
    }

    // GraphQL Benchmarks
    for (let i = 0; i < ITERATIONS; i++) {
      const start = Date.now();
      const res = await request.post('http://localhost:4000/graphql', {
        data: {
          query: `
            query GetProducts {
              products {
                id name description price category stock createdAt updatedAt
              }
            }
          `
        }
      });
      expect(res.ok()).toBeTruthy();
      gqlTimes.push(Date.now() - start);
    }

    const restStats = calculateStats(restTimes);
    const gqlStats = calculateStats(gqlTimes);

    console.log('REST Stats (ms):', restStats);
    console.log('GraphQL Stats (ms):', gqlStats);
  });
});
