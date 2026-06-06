import React, { memo, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { colors, fonts } from '../styles/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { updateProjectLikeUnlike, deleteProjectById } from '../api/endPoints';
import { formatDate, shareImage, downloadImage } from '../utils/Utilities';

const screenWidth = Dimensions.get('window').width;

const ProjectExapandableView = ({
  project,
  expanded,
  onExpand,
  onDisable,
  disableExpand,
  showMessage,
  setRefresh,
}) => {
  const [imageHeight, setImageHeight] = useState(250);
  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [disLikeLoading, setDisLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (project.image_url) {
      Image.getSize(project.image_url, (width, height) => {
        const ratio = height / width;

        setImageHeight(screenWidth * ratio);
      });
    }
  }, [project.image_url]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onExpand();
  };

  const updateProjectLike = async (is_liked, operation) => {
    try {
      updateLoaders(true, operation);
      const project_id = project._id;
      const response = await updateProjectLikeUnlike({ project_id, is_liked });
      updateLoaders(false, operation);
      if (response.data.success) {
        setRefresh(prev => !prev);
        showMessage(
          operation == 'Y'
            ? 'Updated like successfully!'
            : 'Updated dislike successfully!',
          'success',
        );
      } else {
        showMessage('Failed to update!', 'error');
      }
    } catch (error) {
      updateLoaders(false, operation);
      showMessage('Failed to update!', 'error');
    }
  };

  const updateLoaders = (value, isLiked) => {
    setLoading(value);
    isLiked == 'Y' ? setLikeLoading(value) : setDisLikeLoading(value);
    onDisable(value);
  };

  const deleteProject = async () => {
    try {
      updateDeleteLoaders(true);
      const project_id = project._id;
      const response = await deleteProjectById({project_id});
      updateDeleteLoaders(false);
      if (response.data.success) {
        setRefresh(prev => !prev);
        showMessage("Project deleted successfully!", 'success');
      } else {
        showMessage('Failed to update!', 'error');
      }
    } catch (error) {
      updateDeleteLoaders(false);
      showMessage('Failed to delete!', 'error');
    }
  };

  const updateDeleteLoaders = (value, isLiked) => {
    setLoading(value);
    setDeleteLoading(value);
    onDisable(value);
  };

  return (
    <>
      <View style={[styles.card]}>
        <TouchableOpacity
          style={styles.header}
          onPress={toggleExpand}
          disabled={disableExpand}
          activeOpacity={0.8}
        >
          <Text style={styles.title}>
            {project.operation} ({formatDate(project.createdAt)})
          </Text>

          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
        {expanded && (
          <View style={styles.body}>
            <Text style={styles.prompt}>{project.prompt}</Text>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: project.image_url }}
                style={{
                  width: '100%',
                  height: imageHeight,
                  borderRadius: 10,
                  paddingVertical: 10,
                }}
                resizeMode="cover"
              />
              <View style={styles.iconRow}>
                <TouchableOpacity
                  style={[styles.iconButton, loading && styles.disabledButton]}
                  onPress={() =>
                    updateProjectLike(project.is_liked === 'Y' ? '' : 'Y', 'Y')
                  }
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {likeLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Ionicons
                      name={
                        project.is_liked === 'Y' && project.is_liked !== ''
                          ? 'thumbs-up'
                          : 'thumbs-up-outline'
                      }
                      size={25}
                      color={colors.secondary}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, loading && styles.disabledButton]}
                  onPress={() => updateProjectLike('N')}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {disLikeLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Ionicons
                      name={
                        project.is_liked === 'N' && project.is_liked !== ''
                          ? 'thumbs-down'
                          : 'thumbs-down-outline'
                      }
                      size={25}
                      color={colors.secondary}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, loading && styles.disabledButton]}
                  disabled={loading}
                  activeOpacity={0.8}
                  onPress={() => downloadImage(project.image_url, showMessage)}
                >
                  <Ionicons
                    name="download-outline"
                    size={25}
                    color={colors.secondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, loading && styles.disabledButton]}
                  disabled={loading}
                  activeOpacity={0.8}
                  onPress={() => shareImage(project.image_url)}
                >
                  <Ionicons
                    name="share-social"
                    size={25}
                    color={colors.secondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, loading && styles.disabledButton]}
                  disabled={loading}
                  activeOpacity={0.8}
                  onPress={() => deleteProject()}
                >
                  {deleteLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Ionicons
                      name="trash-outline"
                      size={25}
                      color={colors.secondary}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default memo(ProjectExapandableView);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.secondary,
  },
  body: {
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  prompt: {
    fontFamily: fonts.bold,
    color: colors.primary,
    fontSize: 13,
  },
  title: {
    fontSize: 15,
    color: colors.primary,
    fontFamily: fonts.bold,
  },

  imageContainer: {
    marginTop: 10,
    position: 'relative',
  },

  iconRow: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: 10,
    zIndex: 999,
  },

  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',

    width: 45,
    height: 45,

    backgroundColor: colors.primary,
    borderRadius: 25,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
  },
  disabledButton: {
    opacity: 0.5,
  },
});