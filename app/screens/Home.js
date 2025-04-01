import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ProfileImage from '../components/ProfileImage';
import SearchBar  from '../components/SearchBar';
import * as SQLite from 'expo-sqlite';

const openDatabase = async () => SQLite.openDatabaseAsync('actual_little_lemon.db')

const setupDatabase = async (db) => {
  try {
    await db.execAsync(
      'CREATE TABLE IF NOT EXISTS menu (name TEXT, description TEXT, price REAL, image TEXT, category TEXT);'
    );
    console.log('Table setup is successful');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

const insertMenuItems = async (db, menu) => {
  try {
    for (const item of menu) {
      await db.runAsync(
        'INSERT OR IGNORE INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?);',
        [item.name, item.description, item.price, item.image, item.category]
      );
    }
    console.log('Menu items inserted');
  } catch(error) {
    console.error('Error inserting menu items:', error);
  }
};

const fetchMenuFromDB = async (db) => {
  try {
    const results = await db.getAllAsync('SELECT * FROM menu;');
    return results;
  } catch (error) {
    console.error('Error fetching menu from DB:', error);
    return [];
  }
};

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [menuItem, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMenu, setFilteredMenu] = useState([]);

  const categories = ["Starters", "Mains", "Desserts", "Drinks", "Specials"]; 
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchMenuItems = async (db) => {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch menu items')
      }
      const json = await response.json();
      const menu = json.menu || [];
      
      if (menu.length > 0) {
        await insertMenuItems(db,menu);
        setMenuItems(menu);
      } else {
        console.warn('No menu items found in the API response');
      }
      return menu;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  };

  /*
  If no category is selected, fetch all menu items 
  create a query for selected categories 
  error clause
  useEffect
   */
  /*
Create a SQL query to filter a group of categories 
Query kicks in when there is a change in the categories selected 
(When a category is selected it will display the menu items of that cateory)
SELECT * from menu WHERE category = picked categories 
leverage the useEffect hook to detect changes in the list of active categories 
 */

useEffect(() => {
  const initalizeDatabaseAndFetchMenu = async () => {
    const db = await openDatabase();
    await setupDatabase(db);
    const storedMenuData = await fetchMenuFromDB(db);
    if (storedMenuData.length === 0) {
      const apiMenuData = await fetchMenuItems(db);
      setData(apiMenuData);
    } else {
      setData(storedMenuData);
    }
    setIsLoading(false);
  };
  initalizeDatabaseAndFetchMenu();
}, []);
  
useEffect(() => {
  const fetchFilteredMenu = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('actual_little_lemon.db');
      
      if (selectedCategories.length === 0) {
        const allItems = await db.getAllAsync('SELECT * FROM menu;');
        setMenuItems(allItems);
      } else {
        const placeholders = selectedCategories.map(() => '?').join(', ');
        const query = `SELECT * FROM menu WHERE LOWER(category) IN (${placeholders});`;
        
        const filteredItems = await db.getAllAsync(query, selectedCategories.map(cat => cat.toLowerCase()));
        setMenuItems(filteredItems);
      }
    } catch (error) {
      console.error("Error filtering menu items:", error);
    }
  };

  fetchFilteredMenu();
}, [selectedCategories]);  
 

useEffect(() => {
 
  if (!menuItem || menuItem.length === 0) {
    console.warn("No menu items available to filter!");
    return;
  }

  if (searchQuery.trim() === '') {
    setFilteredMenu(menuItem);
  } else {
    const filtered = menuItem.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMenu(filtered);
  }
}, [searchQuery, menuItem]);


  useEffect(() => {
    const loadData = async () => {
        try {
            const storedFirstName = await AsyncStorage.getItem('firstName');
            const storedEmail = await AsyncStorage.getItem('email');
            const storedProfileImage = await AsyncStorage.getItem('profileImage');
            if  (storedFirstName) setFirstName(storedFirstName);
            if  (storedEmail) setEmail(storedEmail);
            if  (storedProfileImage) setProfileImage(storedProfileImage);
        } catch (error) {
            console.error('Error loading data', error);
        }
    };
    loadData();
}, []);

  return (
    <View style={styles.container}>
    <View style={styles.heading_container}>
        <Pressable 
            onPress={() => router.back()} 
            style={styles.backButton}
            accessibilityLabel="Go back"
        >
            <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Image 
            style={styles.logo}
            source={require('../../assets/images/logo.jpg')}
        />
        <Text style={styles.heading}>Little Lemon</Text>
        <ProfileImage 
            profileImage={profileImage}
            firstName={firstName}
            lastName={lastName}
            onPress={() => router.push('/screens/Profile')} 
            customStyle={{ width: 50, height: 50, borderRadius: 30, right: -10 }} 
        />
      </View>
      <View style={styles.banner}>
        <View style={styles.bannerTextContainer}>
          <Text style={styles.banner_header}>Little Lemon</Text>
          <Text style={styles.banner_subtitles}>Chicago</Text>
          <Text style={styles.banner_paragraph}>
              We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
        </View>
        <Image 
          source={require('../../assets/images/hero_image.png')} 
          style={styles.bannerImage} 
        />
      </View>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>

      <Text style = {styles.order}>Order For Delivery!</Text>
      <ScrollView horizontal style={styles.container2} contentContainerStyle={styles.contentContainer} showsHorizontalScrollIndicator={false}>
    {categories.map((category) => (
    <TouchableOpacity
      key={category}
      style={[styles.categoryItem, selectedCategories.includes(category) && styles.selectedItem]}
      onPress = {() => {
        setSelectedCategories((prev) => {
          const updatedCategories = prev.includes(category)
            ? prev.filter((c) => c !== category)
            : [...prev, category]
          console.log('Selected Categories:', updatedCategories);
          return updatedCategories;
        });
      }}
    >
      <Text style={[styles.categoryText, selectedCategories.includes(category) && styles.selectedText]}>
        {category}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>

      <View style = {{flex: 1, padding: 24}}>
        {isLoading ? (
          <ActivityIndicator/>
        ) : (
          <FlatList
            data = {filteredMenu}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}            
            renderItem = {({item}) => (
             <View style={styles.menuItem}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.description} numberOfLines={2} ellipsizeMode='tail'>{item.description}</Text>
                <Text style={styles.price}>${item.price}</Text>
              </View>
              {item.image && (
                <Image
                    source={{
                    uri: `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/${item.image}`,
                    }}  
          style={styles.menuImage}
        />
      )}
             </View>
            )}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container2: {
    maxHeight: 60, 
    paddingTop: 15,
  },
  contentContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryItem: {
    padding: 8,
    marginHorizontal: 5, 
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: 'center',
    height: 35, 
    width: 85,
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: "#495E57",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
    fontWeight: 'bold',
    fontColor: '#495E57'
  },
  selectedText: {
    color: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
},
heading_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginLeft: 10,
},
heading: {
    fontFamily: 'times', 
    fontSize: 25,
    fontWeight: 'bold',
    letterSpacing: 5,
    paddingHorizontal: 10,
    color: '#495E57',
},
logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
},
backButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#495E57',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  left: -20,
},
menuItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  borderBottomWidth: 0.15,
  borderBottomColor: '#495E57',
  borderTopWidth: 0.25,
  borderTopColor: '#495E57',
  paddingVertical: 20,
},
textContainer: {
  flex: 1,
},
title: {
  fontSize: 20,
  fontWeight: '600',
  color: 'black',
  paddingVertical: 5,
},
description: {
  fontSize: 16,
  color: '#495E57',
  paddingVertical: 5,
},
price: {
  fontSize: 16,
  color: '#495E57',
  paddingVertical: 5,
},
menuImage: {
  width: 120,
  height: 120,
  resizeMode: 'cover',
  padding: 10,
},
order: {
  fontWeight: 'bold',
  fontSize: 20, 
  paddingHorizontal: 20,
  marginBottom: 5, 
  fontFamily: 'times',
  paddingTop: 20,
},
banner_header: {
  fontSize: 40,
  fontWeight: 500,
  color: '#FFDB58',
  paddingLeft: 20,
  fontFamily: 'times',
  flexDirection: 'row',
},
banner_subtitles: {
  fontSize: 30,
  fontWeight: 400,
  color: 'white',
  paddingLeft: 20,
  fontFamily: 'times',
},
banner_paragraph: {
  fontSize: 16,
  fontWeight: 400,
  color: 'white',
  padding: 20,
  fontFamily: 'times',
},
banner: {
  flexDirection: 'row',  
  alignItems: 'center',  
  justifyContent: 'space-between', 
  height: 250,
  backgroundColor: '#495E57',
  marginTop: 10,
},

bannerTextContainer: {
  flex: 1, 
  justifyContent: 'flex-start',
},

bannerImage: {
  width: 150, 
  height: 130, 
  marginRight: 20,
  marginLeft: 15,
  borderRadius: 10,
  resizeMode: 'cover',
},


})