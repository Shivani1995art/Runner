const data = [
  {
    "id": 1,
    "title": "Sunset Bay Resort",
    "type": "Resort",
    "distance": "0.8 KM",
    "location": "Miami, Florida",
    "image": { "uri": "https://picsum.photos/600/400?random=1" }
  },
  {
    "id": 2,
    "title": "Palm Beach Resort",
    "type": "Resort",
    "distance": "1.1 KM",
    "location": "Malibu, California",
    "image": { "uri": "https://picsum.photos/600/400?random=2" }
  },
  {
    "id": 3,
    "title": "Coral Reef Resort",
    "type": "Resort",
    "distance": "0.6 KM",
    "location": "Goa, India",
    "image": { "uri": "https://picsum.photos/600/400?random=3" }
  },
  {
    "id": 4,
    "title": "Blue Lagoon Retreat",
    "type": "Resort",
    "distance": "1.3 KM",
    "location": "Bali, Indonesia",
    "image": { "uri": "https://picsum.photos/600/400?random=4" }
  },
  {
    "id": 5,
    "title": "Royal Island Resort",
    "type": "Resort",
    "distance": "2.1 KM",
    "location": "Honolulu, Hawaii",
    "image": { "uri": "https://picsum.photos/600/400?random=5" }
  },
  {
    "id": 6,
    "title": "Ocean View Paradise",
    "type": "Resort",
    "distance": "1.8 KM",
    "location": "Dubai, UAE",
    "image": { "uri": "https://picsum.photos/600/400?random=6" }
  },
  {
    "id": 7,
    "title": "Mountain Peak Escape",
    "type": "Resort",
    "distance": "0.9 KM",
    "location": "Phuket, Thailand",
    "image": { "uri": "https://picsum.photos/600/400?random=7" }
  },
  {
    "id": 8,
    "title": "Golden Sands Resort",
    "type": "Resort",
    "distance": "2.4 KM",
    "location": "Santorini, Greece",
    "image": { "uri": "https://picsum.photos/600/400?random=8" }
  },
  {
    "id": 9,
    "title": "Dream Valley Resort",
    "type": "Resort",
    "distance": "1.6 KM",
    "location": "Gold Coast, Australia",
    "image": { "uri": "https://picsum.photos/600/400?random=9" }
  },
  {
    "id": 10,
    "title": "Four Seasons Resort",
    "type": "Resort",
    "distance": "0.7 KM",
    "location": "Lake Tahoe, Nevada",
    "image": { "uri": "httpsum.photos/600/400?random=10" }
  },

  {
    "id": 11,
    "title": "Ocean Pearl Resort",
    "type": "Resort",
    "distance": "1.5 KM",
    "location": "Miami Beach, Florida",
    "image": { "uri": "https://picsum.photos/600/400?random=11" }
  },
  {
    "id": 12,
    "title": "Lagoon Breeze Resort",
    "type": "Resort",
    "distance": "0.9 KM",
    "location": "Hikkaduwa, Sri Lanka",
    "image": { "uri": "https://picsum.photos/600/400?random=12" }
  },
  {
    "id": 13,
    "title": "White Sand Paradise",
    "type": "Resort",
    "distance": "2.3 KM",
    "location": "Boracay, Philippines",
    "image": { "uri": "https://picsum.photos/600/400?random=13" }
  },
  {
    "id": 14,
    "title": "Royal Orchid Resort",
    "type": "Resort",
    "distance": "1.0 KM",
    "location": "Chiang Mai, Thailand",
    "image": { "uri": "https://picsum.photos/600/400?random=14" }
  },
  {
    "id": 15,
    "title": "Sunrise Cliff Resort",
    "type": "Resort",
    "distance": "0.5 KM",
    "location": "Oia, Santorini",
    "image": { "uri": "https://picsum.photos/600/400?random=15" }
  },
  {
    "id": 16,
    "title": "Tropical Haven Resort",
    "type": "Resort",
    "distance": "1.8 KM",
    "location": "Maldives",
    "image": { "uri": "https://picsum.photos/600/400?random=16" }
  },
  {
    "id": 17,
    "title": "Island Escape Resort",
    "type": "Resort",
    "distance": "2.0 KM",
    "location": "Mauritius",
    "image": { "uri": "https://picsum.photos/600/400?random=17" }
  },
  {
    "id": 18,
    "title": "Sea Breeze Resort",
    "type": "Resort",
    "distance": "1.2 KM",
    "location": "Key West, Florida",
    "image": { "uri": "https://picsum.photos/600/400?random=18" }
  },
  {
    "id": 19,
    "title": "Azure Coast Resort",
    "type": "Resort",
    "distance": "2.5 KM",
    "location": "Nice, France",
    "image": { "uri": "https://picsum.photos/600/400?random=19" }
  },
  {
    "id": 20,
    "title": "Harbor View Resort",
    "type": "Resort",
    "distance": "1.3 KM",
    "location": "Sydney, Australia",
    "image": { "uri": "https://picsum.photos/600/400?random=20" }
  },

  {
    "id": 21,
    "title": "Paradise Cove Resort",
    "type": "Resort",
    "distance": "0.6 KM",
    "location": "Fiji",
    "image": { "uri": "https://picsum.photos/600/400?random=21" }
  },
  {
    "id": 22,
    "title": "Blue Pearl Retreat",
    "type": "Resort",
    "distance": "1.9 KM",
    "location": "Seychelles",
    "image": { "uri": "https://picsum.photos/600/400?random=22" }
  },
  {
    "id": 23,
    "title": "Coral Sands Villa",
    "type": "Resort",
    "distance": "2.7 KM",
    "location": "Bora Bora",
    "image": { "uri": "https://picsum.photos/600/400?random=23" }
  },
  {
    "id": 24,
    "title": "Skyline Beach Resort",
    "type": "Resort",
    "distance": "0.4 KM",
    "location": "Rio de Janeiro, Brazil",
    "image": { "uri": "https://picsum.photos/600/400?random=24" }
  },
  {
    "id": 25,
    "title": "Crystal Wave Resort",
    "type": "Resort",
    "distance": "2.2 KM",
    "location": "Cape Town, South Africa",
    "image": { "uri": "https://picsum.photos/600/400?random=25" }
  },

  {
    "id": 26,
    "title": "Sea Cliff Escape",
    "type": "Resort",
    "distance": "1.4 KM",
    "location": "Madeira, Portugal",
    "image": { "uri": "https://picsum.photos/600/400?random=26" }
  },
  {
    "id": 27,
    "title": "Wavefront Retreat",
    "type": "Resort",
    "distance": "1.1 KM",
    "location": "Barcelona, Spain",
    "image": { "uri": "https://picsum.photos/600/400?random=27" }
  },
  {
    "id": 28,
    "title": "Coral Breeze Getaway",
    "type": "Resort",
    "distance": "2.0 KM",
    "location": "Thailand",
    "image": { "uri": "https://picsum.photos/600/400?random=28" }
  },
  {
    "id": 29,
    "title": "Lagoon Crest Resort",
    "type": "Resort",
    "distance": "0.9 KM",
    "location": "Malaysia",
    "image": { "uri": "https://picsum.photos/600/400?random=29" }
  },
  {
    "id": 30,
    "title": "Silver Sands Stay",
    "type": "Resort",
    "distance": "1.7 KM",
    "location": "Sri Lanka",
    "image": { "uri": "https://picsum.photos/600/400?random=30" }
  },

  {
    "id": 31,
    "title": "Beach Crest Paradise",
    "type": "Resort",
    "distance": "1.3 KM",
    "location": "Tel Aviv, Israel",
    "image": { "uri": "https://picsum.photos/600/400?random=31" }
  },
  {
    "id": 32,
    "title": "Azure Wave Resort",
    "type": "Resort",
    "distance": "1.6 KM",
    "location": "Portugal",
    "image": { "uri": "https://picsum.photos/600/400?random=32" }
  },
  {
    "id": 33,
    "title": "Palm Horizon Resort",
    "type": "Resort",
    "distance": "2.3 KM",
    "location": "Mexico",
    "image": { "uri": "https://picsum.photos/600/400?random=33" }
  },
  {
    "id": 34,
    "title": "Blue Reef Getaway",
    "type": "Resort",
    "distance": "1.9 KM",
    "location": "Dominican Republic",
    "image": { "uri": "https://picsum.photos/600/400?random=34" }
  },
  {
    "id": 35,
    "title": "Coastal Dream Resort",
    "type": "Resort",
    "distance": "0.6 KM",
    "location": "Costa Rica",
    "image": { "uri": "https://picsum.photos/600/400?random=35" }
  },

  {
    "id": 36,
    "title": "Blue Horizon Hotel",
    "type": "Resort",
    "distance": "1.2 KM",
    "location": "New Zealand",
    "image": { "uri": "https://picsum.photos/600/400?random=36" }
  },
  {
    "id": 37,
    "title": "Island Mist Retreat",
    "type": "Resort",
    "distance": "2.4 KM",
    "location": "Fiji",
    "image": { "uri": "https://picsum.photos/600/400?random=37" }
  },
  {
    "id": 38,
    "title": "Coral Palace Resort",
    "type": "Resort",
    "distance": "1.1 KM",
    "location": "Bahamas",
    "image": { "uri": "https://picsum.photos/600/400?random=38" }
  },
  {
    "id": 39,
    "title": "Lagoon Island Resort",
    "type": "Resort",
    "distance": "2.6 KM",
    "location": "Mauritius",
    "image": { "uri": "https://picsum.photos/600/400?random=39" }
  },
  {
    "id": 40,
    "title": "Ocean Crown Resort",
    "type": "Resort",
    "distance": "1.4 KM",
    "location": "Maldives",
    "image": { "uri": "https://picsum.photos/600/400?random=40" }
  },

  {
    "id": 41,
    "title": "Pearl Cove Retreat",
    "type": "Resort",
    "distance": "0.7 KM",
    "location": "Hawaii",
    "image": { "uri": "https://picsum.photos/600/400?random=41" }
  },
  {
    "id": 42,
    "title": "Coastline Bliss Resort",
    "type": "Resort",
    "distance": "2.3 KM",
    "location": "Florida Keys",
    "image": { "uri": "https://picsum.photos/600/400?random=42" }
  },
  {
    "id": 43,
    "title": "Harbor Luxe Resort",
    "type": "Resort",
    "distance": "1.8 KM",
    "location": "California",
    "image": { "uri": "https://picsum.photos/600/400?random=43" }
  },
  {
    "id": 44,
    "title": "Aqua Breeze Resort",
    "type": "Resort",
    "distance": "1.0 KM",
    "location": "Mexico",
    "image": { "uri": "https://picsum.photos/600/400?random=44" }
  },
  {
    "id": 45,
    "title": "Coral View Escape",
    "type": "Resort",
    "distance": "0.9 KM",
    "location": "Philippines",
    "image": { "uri": "https://picsum.photos/600/400?random=45" }
  },

  {
    "id": 46,
    "title": "Sunrise Haven Resort",
    "type": "Resort",
    "distance": "2.7 KM",
    "location": "Dubai",
    "image": { "uri": "https://picsum.photos/600/400?random=46" }
  },
  {
    "id": 47,
    "title": "Golden Reef Resort",
    "type": "Resort",
    "distance": "1.8 KM",
    "location": "Oman",
    "image": { "uri": "https://picsum.photos/600/400?random=47" }
  },
  {
    "id": 48,
    "title": "Elite Coast Resort",
    "type": "Resort",
    "distance": "1.4 KM",
    "location": "Spain",
    "image": { "uri": "https://picsum.photos/600/400?random=48" }
  },
  {
    "id": 49,
    "title": "Royal Marine Resort",
    "type": "Resort",
    "distance": "0.6 KM",
    "location": "Greece",
    "image": { "uri": "https://picsum.photos/600/400?random=49" }
  },
  {
    "id": 50,
    "title": "Prestige Ocean Resort",
    "type": "Resort",
    "distance": "2.1 KM",
    "location": "Italy",
    "image": { "uri": "https://picsum.photos/600/400?random=50" }
  }
];


import React, { useState } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import SwipeCard from "./SwipeCard";
import ResortCard from "./ResortCard";
import { hp } from "../../utils/responsive";
const { width } = Dimensions.get("window");
const VISIBLE_CARDS = 5;

export default function CardStack() {
  const [cards, setCards] = useState(data);
  const handleRemove = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };
  return (
    <View
      style={styles.container}
    >
      {cards.slice(0, VISIBLE_CARDS).map((item, index) => {
        const depth = index;
        const style = {
          position: "absolute",
          zIndex: VISIBLE_CARDS - depth,
          width: width - 40 - depth * 10,
          top: depth * 15,
          transform: [{ scale: 1 - depth * 0.05 }],
        };

        const isTop = index === 0;

        return (
          <Animated.View key={item.id} style={style}>
            {isTop ? (
              <SwipeCard
                onSwipeLeft={() => handleRemove(item.id)}
                onSwipeRight={() => handleRemove(item.id)}
              >
                <ResortCard {...item} />
              </SwipeCard>
            ) : (
              <ResortCard {...item} />
            )}
          </Animated.View>
        );
      })}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  }
})
