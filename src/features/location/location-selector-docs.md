# Location Selector Component

A user-friendly map component that allows users to select locations in Bangladesh. Think of it as a super-charged address picker with a visual map interface.

## What Can It Do?

- 🔍 Search for places with auto-complete suggestions
- 📍 Pick a location by clicking on the map
- 📱 Use the device's current location
- 🎯 Show selected locations with a marker
- 📝 Display the full address of selected locations
- 🔄 Start with a pre-selected location (optional)

## How to Use It

```tsx
import { LocationSelector } from "@/components/location-selector";

function MyComponent() {
  const handleLocationSelect = (location) => {
    console.log("Selected address:", location.address);
    console.log("Latitude:", location.lat);
    console.log("Longitude:", location.lng);
  };

  return (
    <LocationSelector
      onSelectLocation={handleLocationSelect}
      initialLocation={{
        address: "Dhaka, Bangladesh",
        lat: 23.8103,
        lng: 90.4125
      }}
    />
  );
}
```

## Main Features Explained

### 1. Search Box
- Type any address in Bangladesh
- Get smart suggestions as you type
- Click a suggestion to zoom to that location

### 2. Map Interaction
- Click anywhere on the map to select that spot
- The map automatically zooms in when you select a location
- A red marker shows your selected location

### 3. Current Location
- Click "Use Current Location" to use your device's GPS
- Requires location permission from the browser
- Shows a loading state while getting your location

### 4. Location Preview
- Shows the full address of your selected location
- Appears in a card below the map
- Updates automatically as you pick different locations

### 5. Confirmation
- "Confirm Location" button to finalize your selection
- Disabled until you actually select a location
- Triggers the `onSelectLocation` callback with location details

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onSelectLocation | function | Yes | Called when user confirms a location |
| initialLocation | object | No | Pre-selected location to show on load |

## Requirements

- Needs a Google Maps API key in your environment variables
- Works best with an internet connection
- Restricted to locations within Bangladesh
- Requires browser location access for the "Use Current Location" feature

## Styling

- Uses Tailwind CSS for styling
- Fully responsive design
- Clean, modern UI with a floating search box and controls
- Semi-transparent cards for better map visibility

## Error Handling

- Shows error message if Google Maps fails to load
- Displays loading state while initializing
- Shows toast notifications for:
  - Location selection confirmation
  - Current location errors
  - General error messages

## Tips for Best Use

1. Always provide an `onSelectLocation` handler to receive the selected location
2. Consider providing an `initialLocation` if you have a default location
3. Make sure you have a valid Google Maps API key set up
4. The component needs a container with a defined height (default is 500px)
