import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Scholar Sync</h1>
        <p>Your one-stop solution to connect, learn, and grow together!</p>
      </header>

      <section className="home-actions">
        <Link to="/login" className="home-button">
          Login
        </Link>
        <Link to="/signup" className="home-button">
          Signup
        </Link>
      </section>
    </div>
  );
}