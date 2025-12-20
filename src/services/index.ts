import * as authServiceREST from './rest/authService'
import * as userServiceREST from './rest/userService'
import * as tripServiceREST from './rest/tripService'
import * as cityServiceREST from './rest/cityService'
import * as stayServiceREST from './rest/stayService'
import * as serviceServiceREST from './rest/serviceService'
import * as agentServiceREST from './rest/agentService'

import * as authServiceGraphQL from './graphql/authService'
import * as userServiceGraphQL from './graphql/userService'
import * as tripServiceGraphQL from './graphql/tripService'
import * as cityServiceGraphQL from './graphql/cityService'
import * as stayServiceGraphQL from './graphql/stayService'
import * as serviceServiceGraphQL from './graphql/serviceService'
import * as agentServiceGraphQL from './graphql/agentService'

export const services = {
  REST: {
    auth: authServiceREST,
    user: userServiceREST,
    trip: tripServiceREST,
    city: cityServiceREST,
    stay: stayServiceREST,
    service: serviceServiceREST,
    agent: agentServiceREST,
  },
  GraphQL: {
    auth: authServiceGraphQL,
    user: userServiceGraphQL,
    trip: tripServiceGraphQL,
    city: cityServiceGraphQL,
    stay: stayServiceGraphQL,
    service: serviceServiceGraphQL,
    agent: agentServiceGraphQL,
  },
}
