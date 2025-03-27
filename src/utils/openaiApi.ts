
import { toast } from 'sonner';
import { getOpenAIApiKey } from './env';

// Export the getOpenAIApiKey function
export { getOpenAIApiKey } from './env';
export { setOpenAIApiKey } from './env';

// Mock structured data for Hyderabad trips
const hyderabadMockItinerary = `
Day 1: March 30, 2025 – Old City & Heritage Walk
🚶 Mode of Transport: Metro, Walking
💰 Estimated Cost for the Day: ₹1,500

9:00 AM – Charminar & Breakfast at Nimrah Café 🏛️☕
Walk around the historic Charminar and Laad Bazaar
Enjoy Irani chai & Osmania biscuits
Cost: ₹100

11:00 AM – Mecca Masjid & Chowmahalla Palace 🕌🏰
Explore the grand mosque & historic palace
Cost: ₹80 (Palace entry)

1:00 PM – Lunch at a Local Veg Restaurant 🍽️
Try Biryani at Café Bahar (veg options available)
Cost: ₹250

3:00 PM – Salar Jung Museum 🖼️
One of India's largest art collections
Cost: ₹50

5:30 PM – Evening Stroll at Hussain Sagar Lake 🚶
Visit Lumbini Park & Buddha Statue by electric ferry
Cost: ₹100

7:30 PM – Sustainable Dinner at Jiva Imperia 🌱
Organic, plant-based meal
Cost: ₹400

Day 2: March 31, 2025 – Nature & Parks
🚲 Mode of Transport: Metro, Cycling
💰 Estimated Cost for the Day: ₹1,800

6:00 AM – Morning Cycling at KBR Park 🚴🌿
Rent a cycle and ride in nature
Cost: ₹100

8:30 AM – Breakfast at Chutneys 🥞
South Indian breakfast
Cost: ₹200

10:00 AM – Visit Shilparamam (Handicrafts Village) 🛍️
Traditional arts & crafts village
Cost: ₹60

1:00 PM – Lunch at Millet Café 🌾
Millet-based sustainable dishes
Cost: ₹300

3:00 PM – Durgam Cheruvu Lake & Eco-Boat Ride 🚣
Kayaking or electric boat ride
Cost: ₹250

6:00 PM – Gachibowli Biodiversity Park 🌳
Sunset & nature walk
Cost: Free

8:00 PM – Dinner at a Zero-Waste Restaurant 🍛
Minimal-waste meal at Sage Farm Café
Cost: ₹400

Day 3: April 1, 2025 – Science & Sustainability
🚌 Mode of Transport: Metro, Bus
💰 Estimated Cost for the Day: ₹1,700

8:00 AM – Breakfast at Fab Café ☕
Healthy & organic food
Cost: ₹250

9:30 AM – Nehru Zoological Park (Electric Vehicles Inside) 🦁
Eco-friendly zoo experience
Cost: ₹100

1:00 PM – Lunch at an Organic Restaurant 🍲
Farm-to-table dining at Sattvam
Cost: ₹400

3:00 PM – Birla Science Museum & Planetarium 🔭
Interactive science & sustainability exhibits
Cost: ₹150

6:00 PM – Evening Tea at Lamakaan (Eco-Friendly Café) 🍵
Social space for discussions & organic snacks
Cost: ₹100

8:00 PM – Dinner at an Upcycled-Themed Café 🥗
Café with recycled interiors & farm-based meals
Cost: ₹400

Day 4: April 2, 2025 – Ramoji Film City (Sustainable Travel)
🚌 Mode of Transport: Shared Electric Bus
💰 Estimated Cost for the Day: ₹2,000

6:30 AM – Breakfast at Home / Hotel 🍞☕
Cost: ₹100

8:00 AM – Travel to Ramoji Film City by Green Bus 🎬
India's largest film studio with eco-friendly transport
Cost: ₹1,500 (Entry + Bus)

1:00 PM – Lunch at Ramoji's Eco-Friendly Restaurant 🍛
Cost: ₹300

6:00 PM – Return to Hyderabad 🏙️
Shared Electric Bus
Cost: Included in ticket

8:00 PM – Light Dinner at a Vegan Café 🥙
Cost: ₹300

Day 5: April 3, 2025 – Final Day & Shopping
🚋 Mode of Transport: Metro, Walking
💰 Estimated Cost for the Day: ₹1,200

8:00 AM – Breakfast at Subhan Bakery 🍪
Famous for Osmania biscuits & local snacks
Cost: ₹150

10:00 AM – Visit Sudha Cars Museum (Upcycled Art) 🚗
Unique museum with cars made from waste materials
Cost: ₹100

1:00 PM – Lunch at Eat Raja (Zero-Waste Café) 🥤
Plastic-free juice bar
Cost: ₹250

3:00 PM – Visit Laad Bazaar for Handmade Souvenirs 🎁
Walk around & shop for eco-friendly souvenirs
Cost: ₹400

6:00 PM – Sunset at Necklace Road & Cycling 🚲
Rent a cycle & ride by the lake
Cost: ₹100

8:00 PM – Dinner at Chai Kahani (Clay Cups, No Plastic) 🍵
Cost: ₹200
`;

// Hyderabad landmark coordinates for map integration
const hyderabadLandmarks = {
  "Charminar": { lat: 17.3616, lon: 78.4747 },
  "Mecca Masjid": { lat: 17.3604, lon: 78.4736 },
  "Chowmahalla Palace": { lat: 17.3582, lon: 78.4710 },
  "Café Bahar": { lat: 17.3825, lon: 78.4686 },
  "Salar Jung Museum": { lat: 17.3714, lon: 78.4804 },
  "Hussain Sagar Lake": { lat: 17.4239, lon: 78.4738 },
  "Lumbini Park": { lat: 17.4165, lon: 78.4720 },
  "Jiva Imperia": { lat: 17.4367, lon: 78.3875 },
  "KBR Park": { lat: 17.4256, lon: 78.4269 },
  "Chutneys": { lat: 17.4267, lon: 78.4494 },
  "Shilparamam": { lat: 17.4529, lon: 78.3813 },
  "Millet Café": { lat: 17.4379, lon: 78.4456 },
  "Durgam Cheruvu Lake": { lat: 17.4275, lon: 78.3890 },
  "Gachibowli Biodiversity Park": { lat: 17.4107, lon: 78.3350 },
  "Sage Farm Café": { lat: 17.4342, lon: 78.3401 },
  "Fab Café": { lat: 17.4256, lon: 78.4498 },
  "Nehru Zoological Park": { lat: 17.3511, lon: 78.4489 },
  "Sattvam": { lat: 17.4244, lon: 78.4500 },
  "Birla Science Museum": { lat: 17.4130, lon: 78.4613 },
  "Lamakaan": { lat: 17.4213, lon: 78.4594 },
  "Ramoji Film City": { lat: 17.2543, lon: 78.6808 },
  "Subhan Bakery": { lat: 17.4035, lon: 78.4750 },
  "Sudha Cars Museum": { lat: 17.4201, lon: 78.4753 },
  "Eat Raja": { lat: 17.4140, lon: 78.4690 },
  "Laad Bazaar": { lat: 17.3615, lon: 78.4738 },
  "Necklace Road": { lat: 17.4254, lon: 78.4718 },
  "Chai Kahani": { lat: 17.4142, lon: 78.4396 }
};

// Helper function to parse the structured mock data
const parseMockItinerary = (mockData: string, startDate: string, endDate: string) => {
  const days = [];
  const dayBlocks = mockData.split(/Day \d+:/).slice(1);
  
  for (let i = 0; i < dayBlocks.length; i++) {
    const dayBlock = dayBlocks[i];
    const dayTitle = dayBlock.split('\n')[0].trim();
    const dayText = dayBlock.trim();
    
    // Extract day number and date
    const dayNum = i + 1;
    const dateMatch = dayText.match(/March\s+(\d+)|April\s+(\d+)/);
    let dayDate = startDate;
    
    if (dateMatch) {
      // Calculate actual date based on start date
      const providedStartDate = new Date(startDate);
      const adjustedDate = new Date(providedStartDate);
      adjustedDate.setDate(providedStartDate.getDate() + i);
      dayDate = adjustedDate.toISOString().split('T')[0];
    }
    
    // Extract transport mode and cost
    const transportMatch = dayText.match(/Mode of Transport: (.+)/);
    const costMatch = dayText.match(/Estimated Cost for the Day: ₹(.+)/);
    
    const activities = [];
    const timeBlocks = dayText.split(/\d+:\d+ [AP]M/).slice(1);
    
    for (let j = 0; j < timeBlocks.length; j++) {
      const timeMatch = dayText.match(new RegExp(`(\\d+:\\d+ [AP]M)${timeBlocks[j].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').substring(0, 30)}`));
      const time = timeMatch ? timeMatch[1] : `${8 + j}:00 AM`;
      
      const blockLines = timeBlocks[j].trim().split('\n');
      const title = blockLines[0].replace(/–\s+/, '').replace(/🏛️☕|🕌🏰|🍽️|🖼️|🚶|🌱|🚴🌿|🥞|🛍️|🌾|🚣|🌳|🍛|☕|🦁|🍲|🔭|🍵|🥗|🍞☕|🎬|🏙️|🥙|🍪|🚗|🥤|🎁|🚲/g, '').trim();
      
      let description = '';
      let location = '';
      let cost = 0;
      
      // Extract details
      blockLines.forEach(line => {
        if (line.includes('Cost:')) {
          const costText = line.match(/₹(\d+)/);
          if (costText) cost = parseInt(costText[1]);
        } else if (!line.includes('–') && line.trim() && !line.includes('Mode of Transport') && !line.includes('Estimated Cost')) {
          if (!description) {
            description = line.trim();
          } else if (!location && line.includes('at')) {
            location = line.split('at')[1].trim();
          } else {
            description += ' ' + line.trim();
          }
        }
      });
      
      // Extract location
      if (!location) {
        const locationMatch = title.match(/at\s+(.+)/);
        if (locationMatch) {
          location = locationMatch[1];
        } else {
          // Try to find a landmark in the title
          for (const landmark in hyderabadLandmarks) {
            if (title.includes(landmark)) {
              location = landmark;
              break;
            }
          }
          
          // If still no location, use first part of title
          if (!location) {
            const parts = title.split('&');
            location = parts[0].trim();
          }
        }
      }
      
      // Add coordinates if we have them
      let coordinates = null;
      for (const landmark in hyderabadLandmarks) {
        if (title.includes(landmark) || location.includes(landmark)) {
          coordinates = hyderabadLandmarks[landmark];
          break;
        }
      }
      
      // If no specific landmark found, use a default landmark for that day
      if (!coordinates) {
        const defaultLandmarks = [
          "Charminar", "KBR Park", "Birla Science Museum", 
          "Ramoji Film City", "Laad Bazaar"
        ];
        const fallbackLandmark = defaultLandmarks[Math.min(i, defaultLandmarks.length - 1)];
        coordinates = hyderabadLandmarks[fallbackLandmark];
        location = location || fallbackLandmark;
      }
      
      // Determine transport mode based on emoji
      let transportMode: 'walk' | 'bike' | 'bus' | 'train' | 'car' | 'other' = 'other';
      if (dayText.includes('🚶')) transportMode = 'walk';
      else if (dayText.includes('🚲')) transportMode = 'bike';
      else if (dayText.includes('🚌')) transportMode = 'bus';
      else if (dayText.includes('🚋')) transportMode = 'train';
      
      // Create the activity
      activities.push({
        time: time,
        title: title,
        description: description || title,
        location: location,
        transportMode: transportMode,
        duration: "2 hours",
        cost: cost,
        coordinates: coordinates,
        tags: ["sustainable", transportMode]
      });
    }
    
    days.push({
      day: dayNum,
      title: dayTitle,
      date: dayDate,
      activities: activities
    });
  }
  
  return days;
};

// DeepSeek API function (using mock data for Hyderabad)
export const generateSustainableTravelPlan = async (
  prompt: string
): Promise<string> => {
  const apiKey = getOpenAIApiKey();
  
  if (!prompt.toLowerCase().includes('hyderabad')) {
    // For non-Hyderabad destinations, try to use the API if key exists
    if (!apiKey) {
      toast.error('DeepSeek API key is not configured');
      throw new Error('DeepSeek API key is not configured');
    }
    
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are a sustainable travel expert specializing in eco-friendly travel plans with real place names, coordinates, and descriptions.
              
              When suggesting locations, always include:
              1. Real place names (not generic placeholders)
              2. Detailed descriptions of activities possible at that location
              3. Estimated costs in the local currency
              4. Duration information
              5. Sustainable transportation options between locations
              
              Focus on sustainable and eco-friendly options such as:
              - Historical sites and cultural attractions
              - Parks and green spaces
              - Local markets and craft centers
              - Sustainable restaurants and cafes
              - Museums and educational sites
              - Urban farms and sustainable initiatives`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate travel plan');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating travel plan:', error);
      toast.error('Failed to generate travel plan');
      throw error;
    }
  } else {
    // For Hyderabad, return our structured mock data directly
    console.log("Using structured mock data for Hyderabad trip");
    return hyderabadMockItinerary;
  }
};

// Export parsing function to use in API.ts
export const parseHyderabadMockItinerary = parseMockItinerary;
export const hyderabadLandmarkCoordinates = hyderabadLandmarks;
