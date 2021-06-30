# ew-gqlclient

EdgeWorker Graphql client example using @apollo/client library


### 1. DEMO

fetch swapi data and respond back.

```bash
% http https://ewdemo.test.edgekey.net/gqlclient
HTTP/1.1 200 OK
Cache-Control: max-age=180
Connection: keep-alive
Content-Length: 453
Date: Wed, 30 Jun 2021 00:23:32 GMT
Vary: *

{"allFilms":{"films":[{"title":"A New Hope","producers":["Gary Kurtz","Rick McCallum"]},{"title":"The Empire Strikes Back","producers":["Gary Kurtz","Rick McCallum"]},{"title":"Return of the Jedi","producers":["Howard G. Kazanjian","George Lucas","Rick McCallum"]},{"title":"The Phantom Menace","producers":["Rick McCallum"]},{"title":"Attack of the Clones","producers":["Rick McCallum"]},{"title":"Revenge of the Sith","producers":["Rick McCallum"]}]}}
```

---

### 2. Code
```TypeScript
const customFetch = async (uri, options) =>  {
	// Use builtin httpRequest function
	return httpRequest(uri, options);
};

const link = new HttpLink( {
	// this graphql endpoint needed to be on Akamai
	uri: 'http://graphql-end-point/graphql',
	fetch: customFetch,
});

const client = new ApolloClient({
	cache: new InMemoryCache({addTypename: false}),
	link: link,
});

const query = gql`
{
  allFilms {
    films {
      title
      producers
    }
  }
}
`;

let result = await client.query( { query: query } );
```

---

### 3. Tips

+ To make apollo client compatible with EdgeWorker, fetch property on HttpLink can be used. It will overide Networking to use EdgeWorker's built-in httpRequest function.

https://www.apollographql.com/docs/react/networking/advanced-http-networking/#custom-fetching

```TypeScript
const customFetch = async (uri, options) =>  {
  return httpRequest(uri, options);
};

const link = new HttpLink( {
  uri: 'http://ewdemo.test.edgekey.net/swapi/graphql',
  fetch: customFetch,
} );
```

---

+ use rollup replace plugin to delete dead code which cause 'static validation error'

##### rollup.config.js
```TypeScript
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel"
import replace from "@rollup/plugin-replace"

...
    plugins: [
        typescript(),
        commonjs(),
        babel({ babelHelpers: 'bundled' }),
        resolve(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'root = Function' : 'root = () => ',
            preventAssignment: true
        })
    ]
...
```
