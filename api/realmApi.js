import {UpdateMode} from 'realm';
import realm from '../realm/realm';
import * as api from './TicketApi';
import {registerItineraryAccess} from './TransferApi';
const SCHEME_NAME = 'Tickets';

export const saveTickets = tickets =>
  new Promise((resolve, reject) => {
    tickets.forEach(
      ({
        kitDelivered,
        needToSendDelivery,
        needToSendTransfer,
        ticketCode,
        uid,
        userDocument,
        userEmail,
        userName,
      }) => {
        realm.write(() => {
          realm.create(
            SCHEME_NAME,
            {
              kitDelivered,
              needToSendDelivery,
              needToSendTransfer,
              ticketCode,
              uid,
              userDocument,
              userEmail,
              userName,
            },
            UpdateMode.Modified,
          );
        });
      },
    );

    resolve();
  });

export const queryTicketCode = ticketCode =>
  realm.objectForPrimaryKey(SCHEME_NAME, ticketCode);

// Registro de kits

export const registerTicket = async ticketCode => {
  const ticket = queryTicketCode(ticketCode);

  if (ticket === null) throw new Error('Ingresso não encontrado.');

  realm.write(() => {
    ticket.kitDelivered = true;
  });
};

export const registerTicketOffline = async ticketCode => {
  const ticket = queryTicketCode(ticketCode);

  if (ticket === null) throw new Error('Ingresso não encontrado.');
  if (ticket.kitDelivered) throw new Error('Ingresso já registrado.');

  realm.write(() => {
    ticket.kitDelivered = true;
    ticket.needToSendDelivery = true;
  });

  return ticket;
};

export const sendLocallySavedPendingRegisteredTickets = async token => {
  const pendingTickets = realm
    .objects(SCHEME_NAME)
    .filtered('needToSendDelivery == true');

  if (!pendingTickets.length) return null;

  for (const ticket of pendingTickets) {
    try {
      await api.registerTicket(ticket.ticketCode, token);
    } catch (error) {
      console.error(error);
      return null;
    }
    realm.write(() => {
      ticket.needToSendDelivery = false;
    });
  }
};

// Registro de intinerarios

export const registerItinerary = async (ticketCode, itineraryId) => {
  const ticket = queryTicketCode(ticketCode);

  if (ticket === null) throw new Error('Ingresso não encontrado.');
  const {itineraryIds} = ticket;
  if (itineraryIds.length === 2)
    throw new Error('O ingresso já foi registrado.');

  realm.write(() => {
    ticket.itineraryIds =
      itineraryIds.length === 0
        ? [itineraryId]
        : [itineraryIds[0], itineraryId];
  });
};

export const registerItineraryOffline = async (ticketCode, itineraryId) => {
  const ticket = queryTicketCode(ticketCode);

  if (ticket === null) throw new Error('Ingresso não encontrado.');
  const {itineraryIds} = ticket;
  if (itineraryIds.length === 2)
    throw new Error('O ingresso já foi registrado.');

  realm.write(() => {
    ticket.itineraryIds =
      itineraryIds.length === 0
        ? [itineraryId]
        : [itineraryIds[0], itineraryId];
    ticket.needToSendTransfer = true;
  });
};

export const sendLocallySavedPendingRegisteredItineraries = async token => {
  const pendingTickets = realm
    .objects(SCHEME_NAME)
    .filtered('needToSendTransfer == true');

  if (!pendingTickets.length) return null;

  for (const ticket of pendingTickets) {
    const {ticketCode} = ticket;
    let itinerariesSuccessfullySent = true;

    for (const id of [...ticket.itineraryIds]) {
      try {
        await registerItineraryAccess(token, ticketCode, id);
        realm.write(() => {
          ticket.itineraryIds = ticket.itineraryIds.filter(ID => ID !== id);
        });
      } catch (error) {
        console.error(error);
        itinerariesSuccessfullySent = false;
      }
    }

    if (itinerariesSuccessfullySent)
      realm.write(() => {
        ticket.needToSendTransfer = false;
      });
  }
};

export const getAllTickets = () => realm.objects(SCHEME_NAME);
