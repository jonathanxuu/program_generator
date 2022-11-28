import * as Kilt from '@kiltprotocol/sdk-js'

// returns CTYPE from a schema
export function getCtypeSchema(): Kilt.CType {
  return Kilt.CType.fromSchema({
    $schema: 'http://kilt-protocol.org/draft-01/ctype#',
    title: 'passport',
    properties: {
      discord_name: {
        type: 'string'
      },
      verification_code: {
        type: 'string'
      },
      support_team:{
        type: 'string'
      }
    },
    type: 'object'
  })
}