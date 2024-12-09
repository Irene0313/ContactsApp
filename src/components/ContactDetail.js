import * as React from 'react';
import {useEffect, useState} from "react";
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import chroma from 'chroma-js';
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PhoneIcon from '@mui/icons-material/Phone';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import VideocamIcon from '@mui/icons-material/Videocam';
import EmailIcon from '@mui/icons-material/Email';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import EventIcon from '@mui/icons-material/Event';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import {CardMedia} from "@mui/material";
import ContactPageIcon from '@mui/icons-material/ContactPage';
import WorkIcon from "@mui/icons-material/Work";



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


function ContactDetail({ contact }) {
    const management = ['Update', 'Delete'];
    const [anchorElManage, setAnchorElManage] = React.useState(null);

    const handleOpenManageMenu = (event) => {
        setAnchorElManage(event.currentTarget);
    };

    const handleCloseManageMenu = () => {
        setAnchorElManage(null);
    };

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

    // Monitor the changes of selected contact
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [website, setWebsite] = useState('');
    const [country, setCountry] = useState('');
    const [company, setCompany] = useState('');
    const [business, setBusiness] = useState('');
    const [catchPhrase, setCatchPhrase] = useState('');


    useEffect(() => {
        if (contact) {
            setEmail(contact.email);
            setAddress(`${contact.address.suite} ${contact.address.street} ${contact.address.city} ${contact.address.zipcode}`);
            setPhoneNumber(contact.phone);
            setWebsite(contact.website);
            setCompany(contact.company.name);
            setBusiness(contact.company.bs);
            setCatchPhrase(contact.company.catchPhrase);

            // Fetch and Set the Country attribute using lat and lng
            const fetchCountry = async () => {
                const apiKey = "AIzaSyCjPzIT3mY7HjBDq10r_qka0PVtIBn4o_I";
                const lat = contact.address.geo.lat;
                const lng = contact.address.geo.lng;
                const city = contact.address.city;

                const latLngUrl =
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=en&key=${apiKey}&result_type=country`;
                const cityUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&language=en&key=${apiKey}`;


                try {
                    // Retrieve country using lat&lng
                    let response = await fetch(latLngUrl);
                    let data = await response.json();
                    console.log(data);

                    if (data.status === "OK") {
                        const countryComponent = data.results[0].address_components.find(component =>
                            component.types.includes("country")
                        );

                        if (countryComponent) {
                            setCountry(countryComponent.long_name);
                            return;
                        }
                    }

                    // Unable to retrieve country using lat&lng, use city
                    response = await fetch(cityUrl);
                    data = await response.json();

                    if (data.status === "OK") {
                        const countryComponent = data.results[0].address_components.find(component =>
                            component.types.includes("country")
                        );

                        if (countryComponent) {
                            setCountry(countryComponent.long_name);
                        } else {
                            setCountry("Country not found");
                        }
                    } else {
                        setCountry("Not Found");
                    }
                } catch (error) {
                    setCountry("Error fetching country");
                }
            };

            fetchCountry();
        }
    }, [contact]);


    return (
        <div className="contact-card">

            <Card sx={{  margin: '20px', position: 'relative' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '20px', position: 'relative', padding: '26px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <Avatar
                            alt={contact.name}
                            src="/static/images/avatar/3.jpg"
                            sx={{
                                backgroundColor: avatarColor,
                                color: textColor,
                                width: 70,
                                height: 70,
                                marginRight: 3,
                            }}
                        />
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography sx={{ color: "rgba(26,26,28,0.85)"}} variant="h6">@{contact.username}</Typography>
                            <Typography sx={{ color:'#000000', fontWeight: 'bold'}} variant="h5" component="div">
                                {contact.name}
                            </Typography>
                        </Box>
                    </Box>

                    <Tooltip title="Manage Contact">
                        <IconButton
                            onClick={handleOpenManageMenu}
                            sx={{
                                position: 'absolute',
                                top: '10px',
                                right: '25px',
                            }}
                        >
                            <MoreHorizIcon sx={{ color:"#15104D", width: "30px", height: "30px"}}/>
                        </IconButton>
                    </Tooltip>

                    <Menu
                        sx={{ mt: '45px' }}
                        anchorEl={anchorElManage}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElManage)}
                        onClose={handleCloseManageMenu}
                    >
                        {management.map((action) => (
                            <MenuItem key={action} onClick={handleCloseManageMenu}>
                                <Typography sx={{ textAlign: 'center' }}>{action}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Get In Touch Buttons */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '15px', width: '90%', paddingLeft: '7px', gap: '15px' }}>
                        <Button
                            sx={{
                                padding: '16px', borderRadius: '24px', flex: 1,
                                textTransform: 'none', fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #6A4C9C, #A39BB9)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #4d3d70, #888C99)',
                                },
                        }}
                            variant="contained" startIcon={<PhoneIcon  sx={{ width: "25px", height: "25px"}} />}>
                            Phone
                        </Button>

                        <Button
                            sx={{
                                padding: '16px', borderRadius: '24px', flex: 1,
                                textTransform: 'none', fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #6A4C9C, #A39BB9)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #4d3d70, #888C99)',
                                },
                            }}
                            variant="contained" startIcon={<VideocamIcon sx={{ width: "25px", height: "25px"}}  />}>
                            Video
                        </Button>

                        <Button
                            sx={{
                                padding: '16px', borderRadius: '24px', flex: 1,
                                textTransform: 'none', fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #6A4C9C, #A39BB9)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #4d3d70, #888C99)',
                                },
                            }}
                            variant="contained" startIcon={<EmailIcon sx={{ width: "25px", height: "25px"}} />}>
                            Email
                        </Button>

                        <Button
                            sx={{
                                padding: '16px', borderRadius: '24px', flex: 1,
                                textTransform: 'none', fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #6A4C9C, #A39BB9)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #4d3d70, #888C99)',
                                },
                            }}
                            variant="contained" startIcon={<ChatBubbleIcon sx={{ width: "25px", height: "25px"}} />}>
                            Chat
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', marginTop: '15px', width: '90%', paddingLeft: '7px' }}>
                        <Button
                            sx={{
                                flex: 1, padding: '16px', borderRadius: '24px',
                                textTransform: 'none', fontWeight: 'bold', fontSize: '16px',
                                background: 'linear-gradient(45deg, #15104D, #3e1b6c)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #2b0c5f, #4d2a8d)',
                                },
                            }}
                            variant="contained" startIcon={<EventIcon sx={{ width: "25px", height: "25px"}} />}>
                            Scheduling A Meeting With Him/Her
                        </Button>
                    </Box>

                    <Divider sx={{width: '100%', marginTop: '25px', marginBottom: '15px'}} />

                    <Box sx={{maxHeight: '410px', overflowY: 'auto', padding: '5px'}}>

                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
                            <ContactPageIcon sx={{ width: 25, height: 25}}/>
                            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold'}}>
                                Contact Methods
                            </p>
                        </div>

                        {/* Phone Number*/}
                        <TextField
                            id="outlined-read-only-input"
                            label="Phone Number"
                            defaultValue={phoneNumber}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                            sx={{
                                width: '100%',
                                marginTop: '20px',
                                marginBottom: '20px',
                            }}
                        />

                        {/* Email */}
                        <TextField
                            id="outlined-read-only-input"
                            label="Email Address"
                            defaultValue={email}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                            sx={{
                                width: '100%',
                                marginBottom: '20px',
                            }}
                        />

                        {/* Address */}
                        <TextField
                            id="outlined-read-only-input"
                            label="Address"
                            defaultValue= {address}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                            sx={{
                                width: '100%',
                                marginBottom: '20px',
                            }}
                        />


                        {/* Country */}
                        <TextField
                            id="outlined-read-only-input"
                            label="Country"
                            value={country || ""}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                            sx={{
                                width: '100%',
                                marginBottom: '20px',
                            }}
                        />

                        {/* Website */}
                        <TextField
                            id="outlined-read-only-input"
                            label="Website"
                            defaultValue= {website}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                            sx={{
                                width: '100%',
                            }}
                        />

                        <Divider sx={{width: '100%', marginTop: '25px', marginBottom: '15px'}} />

                        {/* Company Card */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
                            <WorkIcon sx={{ width: 25, height: 25}}/>
                            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold'}}>
                                Company
                            </p>
                        </div>

                        <Card sx={{ maxWidth: '100%', marginTop: '20px', position: 'relative' }}>
                            <CardMedia
                                sx={{ height: 140 }}
                                image={`https://picsum.photos/800/600`}
                                title="Company Image"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" sx={{fontWeight: 'bold'}}>
                                    {company}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(26,26,28,1)', fontStyle: 'italic', fontSize: '16px' }}>
                                    "{catchPhrase}."
                                </Typography>

                                <Typography variant="body2" sx={{ padding: '10px', color: 'rgba(26,26,28,1)', fontSize: '17px', textTransform: 'capitalize' }}>
                                    <strong>Business:</strong> {business}
                                </Typography>

                            </CardContent>
                            <CardActions sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 'auto'}} >
                                <Button variant="contained"  size="small"
                                        sx={{textTransform: 'none',background: 'linear-gradient(45deg, #6A4C9C, #A39BB9)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #4d3d70, #888C99)',
                                            },}}>
                                    About Us
                                </Button>
                            </CardActions>
                        </Card>

                    </Box>




                </CardContent>
            </Card>




        </div>



    );
}

export default ContactDetail;