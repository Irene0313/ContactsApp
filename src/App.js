//import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import ContactList from './components/ContactList';
import ContactPage from './components/ContactPage';
import NavigationBar from './components/NavigationBar';
import './App.css';

function App() {
  return (
      <div>

          <div className="app-top-bar">
              <NavigationBar />
          </div>

          <div className="app-container">
              <ContactPage />
          </div>


      </div>
  );
}

export default App;