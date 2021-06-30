# ew-gqlclient

Graphql client example using @apollo/client

##### 2 Tips

###### #1. To make apollo client compatible with EdgeWorker, fetch property on HttpLink can be used.
It will overide Networking to use buitin EdgeWorker httpRequest function.

https://www.apollographql.com/docs/react/networking/advanced-http-networking/#custom-fetching

```
const customFetch = async (uri, options) =>  {
  return httpRequest(uri, options);
};

const link = new HttpLink( {
  uri: 'http://ewdemo.test.edgekey.net/swapi/graphql',
  fetch: customFetch,
} );
```

###### #2. use rollup replace plugin to delete dead code which cause 'static validation error'

###### rollup.config.js
```
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
