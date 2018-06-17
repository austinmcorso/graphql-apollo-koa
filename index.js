const koa = require('koa');
const koaRouter = require('koa-router');
const koaBody = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');
const { makeExecutableSchema } = require('graphql-tools');
 
// DATA
const books = [
  {
    id: 0,
    title: 'The best book',
    authorId: 0,
  },
  {
    id: 1,
    title: 'Terrible book',
    authorId: 1,
  },
  {
    id: 2,
    title: 'TBD',
    authorId: 0,
  },
];
const authors = {
  0: {
    id: 0,
    name: 'Austin'
  },
  1: {
    id: 1,
    name: 'Bob'
  },
}

// SCHEMA
const typeDefs = `
  type Book {
    id: ID!
    title: String!
    author: Author
  }
  
  type Author {
    name: String!
    books: [Book]
  }
  
  type Query {
    getAuthor(id: ID): Author
    getAuthors: [Author]
    getBook(id: ID): Book
    getBooks(authorId: ID): [Book]
  }
`;

// RESOLVERS
const resolvers = {
  Query: {
    getAuthor(root, args, context, info) {
      console.log('QUERY - getAuthor');
      console.log(root, args, context);
      return authors[args.id];
    },
    getAuthors(root, args, context, info) {
      console.log('QUERY - getAuthors');
      console.log(root, args, context);
      return Object.values(authors);
    },
    getBook(root, args, context, info) {
      console.log('QUERY - getBook');
      console.log(root, args, context);
      return books[args.id];
    },
    getBooks(root, args, context, info) {
      console.log('QUERY - getBooks');
      console.log(root, args, context);
      return books;
    },
  },
  Author: {
    books(root, args, context, info) {
      console.log('resolving books field of Author');
      console.log(root, args, context);
      return books.filter(book => book.authorId === root.id);
    },
  },
  Book: {
    author(root, args, context, info) {
      console.log('resolving author field of Book');
      console.log(root, args, context);
      return authors[root.id];
    },
  }
};

// SERVER
const schema = makeExecutableSchema({ typeDefs, resolvers });
const PORT = 8080;
 
const app = new koa();
const router = new koaRouter();
 
// app.use((ctx, next) => {
//   console.log(ctx);
//   next();
// })

router.post('/graphql', koaBody(), graphqlKoa({ schema }));
router.get('/graphql', graphqlKoa({ schema }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);
