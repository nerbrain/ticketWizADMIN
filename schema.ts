// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  calendarDay,
} from '@keystone-6/core/fields';

// the document field is a more complicated field, so it has it's own package
import { document } from '@keystone-6/fields-document';
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from '.keystone/types';
import keystone from './keystone';

export const lists: Lists = {
  Admin: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: 'unique',
      }),

      password: password({ validation: { isRequired: true } }),

      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // this last list is our Tag list, it only has a name field for now

  Event: list({
    access: allowAll,

    fields: {
      name: text({isIndexed: "unique"}),
      description: text(),
      venue: text(),
      date: calendarDay({
        defaultValue: '2023-01-01',
        db: { map: 'my_date' },
        validation: { isRequired: true },
      }),

      ticket: relationship({ ref: 'Ticket.event', many: true }),
    }
  }),

  Ticket: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our Post list
    fields: {

      // with this field, you can set a User as the owner for a ticket
      owner: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: 'User.ticket',

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['telegramId'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
        },

        // a Post can only have one owner
        //   this is the default, but we show it here for verbosity
        many: false,
      }),

      event: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: 'Event.ticket',

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
        },

        // a Post can only have one owner
        //   this is the default, but we show it here for verbosity
        many: false,
      }),
    },
  }),

  User: list({
    access: allowAll,

    fields: {
      name: text(),
      telegramUsername: text(),
      telegramId: text({isIndexed: 'unique'}),
      submitedName: text(),
      email: text(),
      ticket: relationship({ ref: 'Ticket.owner', many: true }),
    },

    // hooks:{
    //   resolveInput: async ({ resolvedData, context }) => {
    //     // Fetch the user's ID here based on the provided ID and set it to the resolvedData
    //     // const user = await context.list.User.findOne({ where: { id: resolvedData.telegramId } });
    //     const user = await context.db.User.findOne({ where: { id: resolvedData.telegramId+''} });
  
    //     return user ? user.id : null;
    //   },
    // }

  })
};
