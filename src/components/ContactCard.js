import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import chroma from 'chroma-js';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';

// Create colour series for the avatar
const avatarColorScale = chroma.scale(['#15104D', '#1D2A56', '#B0BEC5', '#79926C', '#FFB74D', '#64B5F6', '#D4E157'])
    .mode('lab')
    .domain([0, 1, 2, 3])
    .colors(20);

const getTextColor = (avatarColour) => {
    // Check if the avatar colour is a valid color string
    if (!chroma.valid(avatarColour)) return '#333';  // Default text color if bgColor is invalid
    const luminance = chroma(avatarColour).luminance();
    return luminance > 0.5 ? '#15104D' : '#fff';
};


function ContactCard({ contact, isSelected }) {
    const getAvatarColorFromStorage = (contactId) => {
        const storedColor = localStorage.getItem(contactId);
        return storedColor ? storedColor : null;
    };

    const setAvatarColorInStorage = (contactId, color) => {
        localStorage.setItem(contactId, color);
    };

    const storedColor = getAvatarColorFromStorage(contact.id);
    const [avatarColor, setAvatarColor] = useState(storedColor);

    useEffect(() => {
        if (!storedColor) {
            const newColor = avatarColorScale[Math.floor(Math.random() * avatarColorScale.length)];
            setAvatarColor(newColor);
            setAvatarColorInStorage(contact.id, newColor);
        } else {
            setAvatarColor(storedColor);
        }
    }, [storedColor, contact.id]);

    const textColor = getTextColor(avatarColor);

    const backgroundColour = isSelected ? '#C9D6E7' : '#fff';

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                /*border: '1px solid #ccc',*/
                borderRadius: '5px',
                backgroundColor: backgroundColour,
            }}
        >
            <Avatar
                alt={contact.name}
                src="/static/images/avatar/3.jpg"
                sx={{
                    backgroundColor: avatarColor,
                    color: textColor,
                    width: 60,
                    height: 60,
                }}
            />

            <div style={{ marginLeft: '10px' }}>
                <h4 style={{ margin: '0 0 5px 0', textAlign: 'left' }}>{contact.name}</h4>

                <div style={{ display: 'flex', alignItems: 'end', gap: '5px' }}>
                    <EmailIcon sx={{color: 'rgba(21, 16, 77, 1)', width: 22, height: 22}}/>
                    <p style={{ margin: 0, color: 'rgba(26,26,28,0.85)', textAlign: 'left', fontSize: '15px' }}>
                        {contact.email}
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'end', gap: '5px' }}>
                    <WorkIcon sx={{color: 'rgba(21, 16, 77, 1)', width: 22, height: 22}}/>
                    <p style={{ margin: 0, color: 'rgba(26,26,28,0.85)', textAlign: 'left', fontSize: '15px' }}>
                        {contact.company.name}
                    </p>
                </div>

            </div>

        </div>
    );
}

export default ContactCard;