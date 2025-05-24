import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../hooks/useAuth';
import { serverTimestamp } from 'firebase/firestore';
import './AddSmokingLocation.css';

interface LocationInput {
  name: string;
  address: string;
  type: 'INDOOR' | 'OUTDOOR';
  description: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  seating: boolean;
  weatherProtection: boolean;
}

const AddSmokingLocation: React.FC = () => {
  const { user } = useAuth();
  const { add, error } = useFirestore('smokingLocations');
  const [formData, setFormData] = useState<LocationInput>({
    name: '',
    address: '',
    type: 'OUTDOOR',
    description: '',
    latitude: 0,
    longitude: 0,
    operatingHours: '',
    seating: false,
    weatherProtection: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await add({
        ...formData,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        rating: 0,
        reviewCount: 0,
        isVerified: false,
        imageUrl: '',
        features: [],
        status: 'active'
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        address: '',
        type: 'OUTDOOR',
        description: '',
        latitude: 0,
        longitude: 0,
        operatingHours: '',
        seating: false,
        weatherProtection: false
      });
    } catch (err) {
      console.error('Error adding location:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="add-location-form">
      <h2>Add New Smoking Location</h2>
      
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Type:</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="OUTDOOR">Outdoor</option>
          <option value="INDOOR">Indoor</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="operatingHours">Operating Hours:</label>
        <input
          type="text"
          id="operatingHours"
          name="operatingHours"
          value={formData.operatingHours}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="seating"
            checked={formData.seating}
            onChange={handleChange}
          />
          Seating Available
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="weatherProtection"
            checked={formData.weatherProtection}
            onChange={handleChange}
          />
          Weather Protection
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="latitude">Latitude:</label>
        <input
          type="number"
          id="latitude"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
          step="any"
        />
      </div>

      <div className="form-group">
        <label htmlFor="longitude">Longitude:</label>
        <input
          type="number"
          id="longitude"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
          step="any"
        />
      </div>

      {error && <p className="error">{error}</p>}
      
      <button type="submit">Add Location</button>
    </form>
  );
};

export default AddSmokingLocation; 