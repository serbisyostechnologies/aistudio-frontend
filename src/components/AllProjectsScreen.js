import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  Modal,
  Pressable,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { globalStyles, colors, fonts } from '../styles/globalStyles';
import React, { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getProjectsByUserId } from '../api/endPoints';
import { useSelector } from 'react-redux';
import CreationCard from '../components/CreationCard';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../utils/toastConfig';

const PAGE_SIZE = 10;

export default function AllProjectsScreen({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [activeMenu, setActiveMenu] = useState(null);
  const filterOptions = {
    type: ['All', 'Image', 'Collage', 'Video'],
    time: [
      'All',
      'Today',
      '7 Days',
      '30 Days',
      '3 Months',
      '6 Months',
      '9 Months',
      '1 Year',
    ],
  };
  const [filters, setFilters] = useState({
    type: 'All',
    time: 'All',
  });
  const [activeTab, setActiveTab] = useState('type');

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleFilter = () => {
    setActiveTab('type');
    if (showFilter) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowFilter(false));
    } else {
      setShowFilter(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const dropdownStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0], // slides down
        }),
      },
    ],
  };

  const fetchData = useCallback(
    async (pageNumber = 1, refresh = false) => {
      try {
        if (loading || paginationLoading) return;

        if (pageNumber === 1) {
          setLoading(true);
        } else {
          setPaginationLoading(true);
        }

        const userId = user._id;
        const response = await getProjectsByUserId({
          userId,
          limit: PAGE_SIZE,
          skip: (pageNumber - 1) * PAGE_SIZE,
          filters,
        });

        const newData = response.data.projects || [];

        setProjects(prev => {
          if (refresh) {
            return newData;
          }

          // Remove duplicates
          const merged = [...prev, ...newData];

          return merged.filter(
            (item, index, self) =>
              index === self.findIndex(t => t._id === item._id),
          );
        });

        setHasMore(newData.length === PAGE_SIZE);

        setPage(pageNumber);
      } finally {
        setLoading(false);
        setPaginationLoading(false);
        setRefreshing(false);
      }
    },
    [user, loading, paginationLoading, filters],
  );

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <CreationCard
          item={item}
          showMenu={activeMenu === item._id}
          showMessage={setToastMessage}
          onDeleteSuccess={handleDeleteSuccess}
          userId={user._id}
          onToggleMenu={() => {
            console.log(activeMenu);
            setActiveMenu(activeMenu === item._id ? null : item._id);
          }}
        />
      );
    },
    [activeMenu],
  );

  useFocusEffect(
    useCallback(() => {
      fetchData(1, true);
    }, []),
  );

  const renderFooter = () => {
    if (!paginationLoading) return null;
    return (
      <View style={styles.paginationFooter}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const handleLoadMore = () => {
    if (!loading && !paginationLoading && hasMore) {
      fetchData(page + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchData(1, true);
  };

  const setToastMessage = (message, type) => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
    });
  };

  const handleDeleteSuccess = () => {
    fetchData(1, true);
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/backgrounds/home.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <StatusBar
          backgroundColor={colors.primary}
          barStyle="light-content"
          translucent={false}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.subTitle}>AI Projects</Text>

          <TouchableOpacity
            style={{ marginLeft: 'auto' }}
            onPress={toggleFilter}
          >
            <Ionicons name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          numColumns={2}
          data={projects}
          extraData={activeMenu}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          columnWrapperStyle={styles.cardRow}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews={true}
        />
      </ImageBackground>
      {showFilter && (
        <Animated.View style={[styles.filterContainer, dropdownStyle]}>
          <View style={filterStyles.sheet}>
            {/* LEFT + RIGHT CONTAINER */}
            <View style={filterStyles.container}>
              {/* LEFT TABS */}
              <View style={filterStyles.leftPane}>
                {Object.keys(filterOptions).map(tab => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={[
                      filterStyles.tab,
                      activeTab === tab && filterStyles.activeTab,
                    ]}
                  >
                    <Text
                      style={[
                        filterStyles.tabText,
                        activeTab === tab && filterStyles.activeTabText,
                      ]}
                    >
                      {tab.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* RIGHT OPTIONS */}
              <ScrollView
                style={filterStyles.rightPane}
                showsVerticalScrollIndicator={false}
              >
                {filterOptions[activeTab].map(item => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => updateFilter(activeTab, item)}
                    style={[
                      filterStyles.option,
                      filters[activeTab] === item &&
                        filterStyles.selectedOption,
                    ]}
                  >
                    <Text
                      style={[
                        filterStyles.optionText,
                        filters[activeTab] === item &&
                          filterStyles.selectedText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* CLOSE BUTTON */}
            <TouchableOpacity
              onPress={() => {
                setProjects([]);
                setShowFilter(false);
                fetchData(1, true);
              }}
              style={filterStyles.closeBtn}
            >
              <Text style={{ color: '#fff', fontFamily: fonts.bold }}>
                Apply / Close
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scroll: {
    backgroundColor: 'transparent',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#003a6b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 100,
    right: 25,
    alignItems: 'center',
    gap: 15,
  },

  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#003a6b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: colors.secondary,
  },
  title: {
    fontSize: 16,
    color: colors.secondary,
    fontFamily: fonts.bold,
  },

  content: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  projectHeader: {
    backgroundColor: colors.primary,
    padding: 10,
  },
  viewAll: {
    fontFamily: fonts.regular,
    color: 'blue',
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  body: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
  },
  prompt: {
    fontFamily: fonts.bold,
    color: colors.primary,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 15,
    paddingHorizontal: 15,
    paddingBottom: 15,
    marginBottom: 20,
  },
  subTitle: {
    color: colors.secondary,
    fontSize: 18,
    fontFamily: fonts.bold,
    marginLeft: 15,
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 10,
    tintColor: colors.secondary,
  },
  circle: {
    position: 'absolute',
    top: 28,
    right: 15,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    backgroundColor: 'transparent',
  },
  welcomeText: {
    color: colors.primary,
    paddingHorizontal: 15,
    marginTop: 15,
    fontFamily: fonts.bold,
    fontSize: 22,
  },
  activityText: {
    color: colors.primary,
    paddingHorizontal: 15,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  toolContainer: {
    padding: 15,
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  toolTitle: {
    color: colors.primary,
    fontSize: 18,
    fontFamily: fonts.bold,
  },

  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  seeAllText: {
    color: '#4D9DFF',
    fontSize: 16,
    marginRight: 4,
    fontFamily: fonts.bold,
  },

  listContainer: {
    paddingBottom: 10,
  },

  toolCard: {
    width: 140,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#385f88',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 4,
    fontFamily: fonts.bold,
  },

  description: {
    fontSize: 12,
    color: colors.secondary,
    lineHeight: 15,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },

  paginationFooter: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 12,
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#003a6b',
    backgroundColor: '#003a6b',
    color: '#fff',
  },
  selectedBox: {
    borderColor: '#003a6b',
    backgroundColor: '#fff',
  },
  cardRow: {
    paddingHorizontal: 5,
  },
  filterContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: 70,

    left: 10,
    right: 10,

    padding: 10,
    backgroundColor: colors.secondary,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    height: '50%',
  },
});

const filterStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  sheet: {
    height: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },

  container: {
    flex: 1,
    flexDirection: 'row',
  },

  /* LEFT PANEL */
  leftPane: {
    width: 100,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },

  tab: {
    padding: 12,
  },

  activeTab: {
    backgroundColor: '#f0f0f0',
  },

  tabText: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },

  activeTabText: {
    color: '#003a6b',
  },

  /* RIGHT PANEL */
  rightPane: {
    flex: 1,
    padding: 10,
  },

  option: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  selectedOption: {
    backgroundColor: '#003a6b',
    borderColor: '#003a6b',
  },

  optionText: {
    color: colors.primary,
    fontFamily: fonts.regular,
  },

  selectedText: {
    color: '#fff',
  },

  closeBtn: {
    backgroundColor: '#003a6b',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});