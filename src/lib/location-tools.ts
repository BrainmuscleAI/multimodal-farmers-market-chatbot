import { Tool } from '@/types/assistant';

export const locationTools: Tool[] = [
  {
    type: 'function',
    function: {
      name: 'get_user_location',
      description: 'Request the user\'s address and show it on a map',
      parameters: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description: 'The prompt to ask the user for their address'
          },
          required_fields: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['street', 'city', 'state', 'zip', 'country']
            },
            description: 'Required address fields'
          }
        },
        required: ['prompt', 'required_fields']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'display_map',
      description: 'Display a map centered on the provided address',
      parameters: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'The full address to display on the map'
          },
          zoom: {
            type: 'number',
            description: 'Map zoom level (1-20)',
            default: 15
          }
        },
        required: ['address']
      }
    }
  }
];
