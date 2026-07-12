import client from '../apolloClient';
import { gql } from '@apollo/client';

const GET_PRODUCTS = gql`
  query GetProducts($search: String, $category: String) {
    products(search: $search, category: $category) {
      id
      name
      description
      price
      category
      stock
      createdAt
      updatedAt
    }
    categories
  }
`;

const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
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
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      category
      stock
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductUpdateInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      price
      category
      stock
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

const DELETE_ALL_PRODUCTS = gql`
  mutation DeleteAllProducts {
    deleteAllProducts {
      success
      affectedCount
      message
    }
  }
`;

const BULK_INSERT_PRODUCTS = gql`
  mutation BulkInsertProducts($products: [ProductInput!]!) {
    bulkInsertProducts(products: $products) {
      success
      affectedCount
      message
    }
  }
`;

export const graphqlApi = {
  getProducts: async (search = '', category = '', reqId = null) => {
    const context = reqId ? { headers: { 'x-request-id': reqId } } : {};
    const res = await client.query({
      query: GET_PRODUCTS,
      variables: { search, category },
      fetchPolicy: 'network-only', // ensure fresh data
      context
    });
    return {
      products: res.data.products,
      categories: res.data.categories
    };
  },

  getProductById: async (id) => {
    const res = await client.query({
      query: GET_PRODUCT_BY_ID,
      variables: { id },
      fetchPolicy: 'network-only'
    });
    return res.data.product;
  },

  getOptimizedProduct: async (id) => {
    const query = gql`
      query GetOptimizedProduct($id: ID!) {
        product(id: $id) {
          name
          price
        }
      }
    `;
    const res = await client.query({
      query,
      variables: { id },
      fetchPolicy: 'network-only'
    });
    return res.data.product;
  },

  createProduct: async (productData) => {
    const res = await client.mutate({
      mutation: CREATE_PRODUCT,
      variables: { input: productData }
    });
    return res.data.createProduct;
  },

  updateProduct: async (id, productData) => {
    const res = await client.mutate({
      mutation: UPDATE_PRODUCT,
      variables: { id, input: productData }
    });
    return res.data.updateProduct;
  },

  getNestedProduct: async (id, reqId = null) => {
    const context = reqId ? { headers: { 'x-request-id': reqId } } : {};
    const res = await client.query({
      query: gql`
        query GetNestedProduct($id: ID!) {
          product(id: $id) {
            id
            name
            price
            categoryDetails {
              name
              description
            }
            supplier {
              name
              contact
            }
          }
        }
      `,
      variables: { id },
      fetchPolicy: 'network-only',
      context
    });
    return res.data.product;
  },

  deleteProduct: async (id) => {
    const res = await client.mutate({
      mutation: DELETE_PRODUCT,
      variables: { id }
    });
    return res.data.deleteProduct;
  },

  deleteAllProducts: async (reqId = null) => {
    const context = reqId ? { headers: { 'x-request-id': reqId } } : {};
    const res = await client.mutate({
      mutation: DELETE_ALL_PRODUCTS,
      context
    });
    return res.data.deleteAllProducts;
  },

  bulkInsertProducts: async (products, reqId = null) => {
    const context = reqId ? { headers: { 'x-request-id': reqId } } : {};
    const res = await client.mutate({
      mutation: BULK_INSERT_PRODUCTS,
      variables: { products },
      context
    });
    return res.data.bulkInsertProducts;
  }
};
