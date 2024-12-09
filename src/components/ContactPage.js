import React, { useState } from 'react';
import ContactList from './ContactList';
import ContactDetail from './ContactDetail';

/**
 * This is the main component of the Contact Page
 * @returns {Element}
 * @constructor
 */
const ContactsPage = () => {
    const [selectedContact, setSelectedContact] = useState(null);

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 20px)', gap: '20px', padding: '10px' }}>
            {/* Contact List */}
            <div style={{ flex: 1, border: '1px solid rgba(21, 16, 77, 0.5)', borderRadius: '10px', height: '100%' }}>
                <ContactList
                    onSelectContact={handleSelectContact}
                    selectedContact={selectedContact}
                />
            </div>

            {/* Contact Details */}
            <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column'}}>
                {selectedContact ? (
                    <ContactDetail contact={selectedContact} />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <p style={{ color: '#777', fontSize: '18px' }}>Select a contact to see the details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactsPage;