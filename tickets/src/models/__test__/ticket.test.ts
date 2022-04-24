import { Ticket } from "../ticket";

it('implements optimistic concurrency control (OCC)', async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  // Save the ticket to the database
  await ticket.save();

  // fetch two instances of the same ticket
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make a change on each instance of the fetched ticket
  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 10 })

  // save the first fetched ticket instance
  await firstInstance!.save();

  // save the sencond fetched ticket instance and expect an error
  try {

    await secondInstance!.save();
  } catch(err: any) {
    // console.log(err.message)
    expect(err).toBeDefined();
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
})