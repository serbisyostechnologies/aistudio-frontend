import React, { useState } from 'react';
import { colors, fonts } from '../styles/globalStyles';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import { getTimeAgo } from '../utils/Utilities';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { shareImage, downloadImage } from '../utils/Utilities';
import { updateProjectLikeUnlike, deleteProjectById } from '../api/endPoints';

const CreationCard = React.memo(
  ({ item, showMenu, showMessage, onDeleteSuccess, userId, onToggleMenu }) => {
    const [activeAction, setActiveAction] = useState(null);

    const actionIconClicked = action => {
      setActiveAction(action);
      switch (action) {
        case 'likeunlike':
          updateProjectLike();
          break;
        case 'delete':
          deleteProject();
          break;
        case 'share':
          shareProject();
          break;
        case 'download':
          downloadProject();
          break;
      }
    };

    const deleteProject = async () => {
      try {
        const response = await deleteProjectById({ projectId: item._id });
        setActiveAction(null);
        if (response.data.success) {
          onDeleteSuccess();
          showMessage(`${item.category} deleted successfully!`, 'success');
        } else {
          showMessage('Failed to delete!', 'error');
        }
      } catch (error) {
        setActiveAction(null);
        showMessage('Failed to delete!', 'error');
      }
    };

    const updateProjectLike = async () => {
      try {
        const projectId = item._id;
        const isLiked = item.is_liked == 'Y' ? 'N' : 'Y';
        const response = await updateProjectLikeUnlike({
          projectId,
          isLiked,
          userId,
          reason: ""
        });
        setActiveAction(null);
        if (response.data.success) {
          onDeleteSuccess();
          showMessage(
            isLiked == 'Y'
              ? 'Updated like successfully!'
              : 'Updated dislike successfully!',
            'success',
          );
        } else {
          showMessage('Failed to update!', 'error');
        }
      } catch (error) {
        console.log(error.message);
        setActiveAction(null);
        showMessage('Failed to update!', 'error');
      }
    };

    const shareProject = () => {};

    const downloadProject = async () => {
      await downloadImage(item.image_url, showMessage, item.category.toLowerCase());
      setActiveAction(null);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.creationCard,
          {
            zIndex: showMenu ? 999 : 1,
            elevation: showMenu ? 999 : 1,
          },
        ]}
      >
        <View>
          {item.operation.toLowerCase().includes('image') ? (
            <Image
              source={{
                uri: item.image_url,
              }}
              style={styles.image}
            />
          ) : (
            <View style={styles.videoContainer}>
              <Video
                source={{
                  uri: item.image_url,
                }}
                style={styles.video}
                resizeMode="cover"
                paused={true}
              />
            </View>
          )}

          <View style={styles.footer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.creationTitle}>{item.operation}</Text>
              <Text style={styles.time}>{getTimeAgo(item.createdAt)}</Text>
            </View>

            <View style={{ position: 'relative' }}>
              <TouchableOpacity onPress={onToggleMenu}>
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={colors.secondary}
                />
              </TouchableOpacity>

              {showMenu && (
                <View style={styles.menuContainer}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    disabled={activeAction && activeAction !== 'likeunlike'}
                    onPress={() => actionIconClicked('likeunlike')}
                  >
                    {activeAction === 'likeunlike' ? (
                      <ActivityIndicator />
                    ) : (
                      <Ionicons
                        name={
                          item.is_liked === 'Y' && item.is_liked !== ''
                            ? 'thumbs-up'
                            : 'thumbs-up-outline'
                        }
                        size={25}
                        color="#333"
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    disabled={activeAction && activeAction !== 'share'}
                    onPress={() => actionIconClicked('share')}
                  >
                    {activeAction === 'share' ? (
                      <ActivityIndicator />
                    ) : (
                      <Ionicons
                        name="share-social-outline"
                        size={25}
                        color="#333"
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    disabled={activeAction && activeAction !== 'download'}
                    onPress={() => actionIconClicked('download')}
                  >
                    {activeAction === 'download' ? (
                      <ActivityIndicator />
                    ) : (
                      <Ionicons
                        name="download-outline"
                        size={25}
                        color="#333"
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => actionIconClicked('delete')}
                    disabled={activeAction && activeAction !== 'delete'}
                  >
                    {activeAction === 'delete' ? (
                      <ActivityIndicator />
                    ) : (
                      <Ionicons name="trash-outline" size={25} color="red" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

export default CreationCard;

const styles = StyleSheet.create({
  creationCard: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 15,
    marginBottom: 20,
    marginHorizontal: 10,
    maxWidth: '45%',
  },

  videoContainer: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    height: 150,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 15,
  },

  creationTitle: {
    color: colors.secondary,
    fontSize: 14,
    fontFamily: fonts.bold,
  },

  time: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 2,
    fontFamily: fonts.regular,
  },

  video: {
    width: '100%',
    height: '100%',
  },

  menuContainer: {
    position: 'absolute',
    bottom: 10, // or bottom: 40
    right: 40,

    backgroundColor: '#fff',
    borderRadius: 12,

    paddingVertical: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,

    width: 60,
    alignItems: 'center',

    zIndex: 99999,
  },

  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});