import * as authServiceREST from './rest/authService'
import * as userServiceREST from './rest/userService'
import * as tripServiceREST from './rest/tripService'
import * as cityServiceREST from './rest/cityService'
import * as stayServiceREST from './rest/stayService'

import * as authServiceGraphQL from './graphql/authService'
import * as userServiceGraphQL from './graphql/userService'
import * as tripServiceGraphQL from './graphql/tripService'
import * as cityServiceGraphQL from './graphql/cityService'
import * as stayServiceGraphQL from './graphql/stayService'

export const services = {
  REST: {
    auth: authServiceREST,
    user: userServiceREST,
    trip: tripServiceREST,
    city: cityServiceREST,
    stay: stayServiceREST,
  },
  GraphQL: {
    auth: authServiceGraphQL,
    user: userServiceGraphQL,
    trip: tripServiceGraphQL,
    city: cityServiceGraphQL,
    stay: stayServiceGraphQL,
  },
}
