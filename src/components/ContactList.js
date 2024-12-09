import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContactCard from './ContactCard';
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import {InputAdornment, InputLabel} from "@mui/material";
import Button from "@mui/material/Button";
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

function ContactList({ onSelectContact, selectedContact }) {
    // Fetch the contact list
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        // Fetch contacts data from API
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then((response) => setContacts(response.data))
            .catch((error) => console.error('Error fetching contacts:', error));
    }, []);

    // Search Bar -> Matching the input with contact
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter contacts based on the search term
    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting the contact list
    const sortedContacts = [...filteredContacts].sort((a, b) => {
        const nameA = a.name.toUpperCase(); // Normalize to uppercase
        const nameB = b.name.toUpperCase(); // Normalize to uppercase
        return nameA.localeCompare(nameB); // Compare lexicographically
    });

    return (
        <div style={{ padding: '10px', height: '100%' }}>
            {/* Displayed the total number of contacts */}
            <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-end'}}>
                <InputLabel sx={{ color: 'rgba(21, 16, 77, 0.7)', fontWeight: 'bold' }} htmlFor="displayed-contacts-amount">Total Contacts: {contacts.length} </InputLabel>
            </div>


            {/* Search Bar */}
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                    value={searchTerm}
                    onChange={handleSearchChange}
                    variant="standard"
                    placeholder="Search by name or company"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),

                    }}
                    sx={{
                        borderRadius: "5px",
                        backgroundColor: '#f5f5f5',
                        padding: '6px 12px',
                        height: '40px',
                        fontSize: '14px',
                        marginRight: '10px',
                        '& .MuiInput-underline:after': {
                            borderBottomColor: '#15104D',
                        },
                    }}
                />

                <Button
                    variant="contained"
                    startIcon={<PersonAddAltRoundedIcon sx={{ width: 25, height: 25 }} />}
                    sx={{
                        fontWeight: 'bold',
                        padding: '14px',
                        fontSize: '14px',
                        height: '52px',
                        alignItems: 'center',
                        '& .MuiSvgIcon-root': { fontSize: '28px' },
                        background: 'linear-gradient(45deg, #15104D, #3e1b6c)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #2b0c5f, #4d2a8d)',
                        },
                    }}
                >
                    Add New Contact
                </Button>

            </div>


            {/* Contact List */}
            <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 160px)'  }}>
                {sortedContacts.map((contact) => (
                    <div
                        key={contact.id}
                        style={{ marginBottom: '10px', cursor: 'pointer' }}
                        onClick={() => onSelectContact(contact)}
                    >
                        <ContactCard contact={contact} isSelected={selectedContact?.id === contact.id} />
                    </div>
                ))}
                {filteredContacts.length === 0 && (
                    <p style={{ color: '#777', textAlign: 'center' }}>No contacts found</p>
                )}
            </div>

            {/* Hide the Scroll Bar */}
            <style>
                {`div::-webkit-scrollbar {
                width: 0; 
                height: 0; 
                }
                div {
                -ms-overflow-style: none;  
                scrollbar-width: none; }
                `}
            </style>

        </div>
    );
}

export default ContactList;