// Simple NLP service to parse user inputs for train booking

// Extract travel details (source, destination, date) from natural language
export const extractTravelDetails = (text: string): { source: string; destination: string; date: string } | null => {
  try {
    const input = text.toLowerCase();
    
    // Extract source (from X)
    const fromMatch = input.match(/from\s+(\w+)/i);
    const source = fromMatch ? fromMatch[1] : '';
    
    // Extract destination (to Y)
    const toMatch = input.match(/to\s+(\w+)/i);
    const destination = toMatch ? toMatch[1] : '';
    
    // Extract date (on YYYY-MM-DD)
    const dateMatch = input.match(/on\s+(\d{4}-\d{2}-\d{2})/i);
    const date = dateMatch ? dateMatch[1] : '';
    
    if (source && destination && date) {
      return {
        source: source.charAt(0).toUpperCase() + source.slice(1),
        destination: destination.charAt(0).toUpperCase() + destination.slice(1),
        date
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing travel details:', error);
    return null;
  }
};

// Extract passenger details (name, age, gender) from natural language
export const extractPassengerDetails = (text: string): { name: string; age: string; gender: string } | null => {
  try {
    const input = text.toLowerCase();
    
    // Format: "Passenger: [name], [age], [gender]"
    const regex = /passenger:?\s+([a-z\s]+),\s*(\d+),\s*(male|female)/i;
    const match = input.match(regex);
    
    if (match) {
      const name = match[1].trim();
      const age = match[2];
      const gender = match[3].toLowerCase();
      
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        age,
        gender
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing passenger details:', error);
    return null;
  }
};

// Extract class preference from natural language
export const extractClassPreference = (text: string): string | null => {
  try {
    const input = text.toLowerCase();
    
    // Match class types: 1A, 2A, 3A, SL, etc.
    const classMatch = input.match(/\b(1a|2a|3a|sl|sleeper|ac|first|second|third)\b/i);
    
    if (classMatch) {
      const classType = classMatch[1].toLowerCase();
      
      // Map to standard class codes
      switch (classType) {
        case '1a':
        case 'first':
          return '1A';
        case '2a':
        case 'second':
          return '2A';
        case '3a':
        case 'third':
          return '3A';
        case 'sl':
        case 'sleeper':
          return 'SL';
        default:
          return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing class preference:', error);
    return null;
  }
};

// Comprehensive NLP processing for booking intent
export const processBookingIntent = (text: string): any => {
  const travelDetails = extractTravelDetails(text);
  const passengerDetails = extractPassengerDetails(text);
  const classPreference = extractClassPreference(text);
  
  return {
    type: 'booking',
    travelDetails,
    passengerDetails,
    classPreference
  };
};