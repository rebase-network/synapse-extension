import ContactManager from './index';
import contacts from './fixtures/contacts';

describe('contact manager', () => {
  beforeEach(async () => {
    await browser.storage.local.set({
      contacts,
    });
  });
  afterEach(async () => {
    await browser.storage.local.clear();
  });

  it('should able to get contacts', async () => {
    const result = await ContactManager.getContactList();
    expect(result).toHaveLength(contacts.length);
  });

  it('should able to set current contact', async () => {
    const result = await ContactManager.getCurrentContact();

    expect(result).not.toBeNull();

    await ContactManager.setCurrentContact(contacts[0].address);
    expect(await ContactManager.getCurrentContact()).toBe(contacts[0]);

    await ContactManager.setCurrentContact(contacts[1].address);
    expect(await ContactManager.getCurrentContact()).toBe(contacts[1]);
  });

  it('should able to create a contact', async () => {
    const result = await ContactManager.createContact({
      name: 'Lina',
      address: 'lina_address',
    });

    expect(result).toHaveLength(3);
  });

  it('should able to get contact info', async () => {
    const result = await ContactManager.getContact(contacts[0].address);
    expect(result).toBe(contacts[0]);
  });

  it('should able to remove a contact', async () => {
    await ContactManager.setCurrentContact('lina_address');
    const result = await ContactManager.removeContact('lina_address');
    expect(result).toHaveLength(2);
  });
});
