const {ApolloServer, gql} = require('apollo-server')
const { Query } = require('mongoose')

const typeDefs = gql`
     type Product{
        id: String!
        name: String
        price: FLoat
     }

     type OutOfStock {
        restockDate: Date 
     }

     type RegionUnavailability {
        availableRegions: [String!]
     }

     union ProductResult = Product | OutOfStock | RegionUnavailability

     type Query {
        product(id: String): ProductResult
     }

`
const resolvers = {
    ProductResult: {
        __resolveType(obj){
            if(obj.restockDate){
                return 'OutOfStrock'
            }
            if(obj.availableRegions){
                return 'RegionUnavailability'
            }
            if(obj.price){
                return 'Product'
            }
            return null
        }
    },
    Query: {
        product: (_, args) => {}
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  const { url } = await startStandaloneServer(server);
  
  console.log(`🚀  Server ready at: ${url}`);