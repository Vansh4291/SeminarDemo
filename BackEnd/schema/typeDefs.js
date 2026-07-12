export const typeDefs = `#graphql
  type Category {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    updatedAt: String!
  }

  type Supplier {
    id: ID!
    name: String!
    contact: String
    country: String
    createdAt: String!
    updatedAt: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    category: String!
    categoryDetails: Category
    supplier: Supplier
    stock: Int!
    createdAt: String!
    updatedAt: String!
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    category: String!
    stock: Int!
  }

  input ProductUpdateInput {
    name: String
    description: String
    price: Float
    category: String
    stock: Int
  }

  type BulkOperationResult {
    success: Boolean!
    affectedCount: Int!
    message: String!
  }

  type Query {
    products(search: String, category: String): [Product!]!
    product(id: ID!): Product
    categories: [String!]!
  }

  type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductUpdateInput!): Product!
    deleteProduct(id: ID!): Boolean!
    deleteAllProducts: BulkOperationResult!
    bulkInsertProducts(products: [ProductInput!]!): BulkOperationResult!
  }
`;
