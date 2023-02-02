import Realm from 'realm';

class Ticket extends Realm.Object {}
Ticket.schema = {
  name: 'Tickets',
  properties: {
    ticketCode: 'string',
    uid: 'string?',
    userName: 'string',
    userEmail: 'string',
    userDocument: 'string',
    kitDelivered: {type: 'bool', default: false},
    itineraryIds: {type: 'list?', objectType: 'int'},
    needToSendDelivery: {type: 'bool', default: false},
    needToSendTransfer: {type: 'bool', default: false},
  },
  primaryKey: 'ticketCode',
};

export default new Realm({schema: [Ticket]});
