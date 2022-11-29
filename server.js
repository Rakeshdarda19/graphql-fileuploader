

const { ApolloServer, gql , GraphQLUpload} = require('apollo-server');
const path = require('path')
const fs = require('fs')

const typeDefs = gql`
  type File {
    url: String!
  }
  type Query {
    hello: String!
  }
  type Mutation {
    uploadFile(file: Upload!): File!
  }
`;



const resolvers = {
 
    Query: {
      hello: () => 'Hello Worls'
    },
    Mutation: {
        uploadFile: async (parent, { file }) => {
        const { createReadStream,filename, mimetype, encoding } = await file;
        const stream = createReadStream()
        const pathName = path.join(__dirname,`public/images/${filename}`)
        await stream.pipe(fs.createWriteStream(pathName))
        // 1. Validate file metadata.
  
        // 2. Stream file contents into cloud storage:
        // https://nodejs.org/api/stream.html
  
        // 3. Record the file upload in your DB.
        // const id = await recordFile( … )
  
        return { url: `http://localhost:4000/images/${filename}`};
      }
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  server.listen().then(({url}) => {
    console.log(`server ready at${url}`)
  })