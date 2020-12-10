import _ from 'lodash';

interface IContact {
  name: string;
  address: string;
}

const ContactManager = {
  async createContact(contact: IContact): Promise<IContact[]> {
    const contacts = await ContactManager.getContactList();
    contacts.push(contact);
    await browser.storage.local.set({ contacts });

    return ContactManager.getContactList();
  },
  async removeContact(address: string): Promise<IContact[]> {
    const contacts = await ContactManager.getContactList();
    _.remove(contacts, { address });
    await browser.storage.local.set({ contacts });
    const currentContact = await ContactManager.getCurrentContact();
    if (currentContact.address === address) {
      await ContactManager.setCurrentContact(contacts[0]?.address);
    }
    return ContactManager.getContactList();
  },
  async getContactList(): Promise<IContact[]> {
    const { contacts = [] } = await browser.storage.local.get('contacts');
    return contacts;
  },
  async getContact(address: string): Promise<IContact> {
    const contacts = await ContactManager.getContactList();
    return _.find(contacts, { address });
  },
  async getCurrentContact(): Promise<IContact> {
    const contacts = await ContactManager.getContactList();
    const { currentContact = contacts[0] } = await browser.storage.local.get('currentContact');
    return currentContact;
  },
  async setCurrentContact(address: string) {
    if (!address) return;
    const contact = await ContactManager.getContact(address);
    await browser.storage.local.set({ currentContact: contact });
  },
};

export default ContactManager;
