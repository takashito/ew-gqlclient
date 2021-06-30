/// <reference types="akamai-edgeworkers"/>

import { logger } from 'log';
import safeStringify from 'fast-safe-stringify';
import { createResponse } from 'create-response';
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { gql } from 'graphql-tag'
import { httpRequest } from 'http-request';

export async function responseProvider(request: EW.ResponseProviderRequest) {
  logger.log('/gqlclient : start');
  
  try {

    if (request.path == '/gqlclient') {

      const customFetch = async (uri, options) =>  {
        logger.log('customFetch uri:%s, options:%s', uri, safeStringify(options));
        return httpRequest(uri, options);
      };

      const link = new HttpLink( {
        uri: 'http://ewdemo.test.edgekey.net/swapi/graphql',
        fetch: customFetch,
      } );

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
      logger.log('result:%s', safeStringify(result));
      

      return createResponse(
        JSON.stringify(result.data), { headers: { "Vary":["*"] } }
      );
    }
  } catch (error) {
    logger.log('error:%s', safeStringify(error));
    return createResponse(safeStringify(error), { headers: { "Vary":["*"] });
  }
  
  return createResponse(JSON.stringify({path:request.path, query:request.query, response:"ok"}), { headers: { "Vary":["*"] } });
}
