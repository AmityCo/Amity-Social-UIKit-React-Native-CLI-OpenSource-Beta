import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
// import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  ViewStyle,
  StyleProp,
  ImageStyle,
} from 'react-native';
import styles from './styles';
import { SvgXml } from 'react-native-svg';
import {
  arrowXml,
  commentXml,
  likedXml,
  likeXml,
  personXml,
} from '../../../svg/svg-xml-list';

import type { UserInterface } from '../../../types/user.interface';
import {
  addPostReaction,
  getPostById,
  removePostReaction,
} from '../../../providers/Social/feed-sdk';
import { getCommunityById } from '../../../providers/Social/communities-sdk';

import ImageView from 'react-native-image-viewing';
export interface IPost {
  postId: string;
  data: Record<string, any>;
  dataType: string | undefined;
  myReactions: string[];
  reactionCount: Record<string, number>;
  commentsCount: number;
  user: UserInterface | undefined;
  updatedAt: string | undefined;
  editedAt: string | undefined;
  createdAt: string;
  targetType: string;
  targetId: string;
  childrenPosts: string[];
}
export interface IPostList {
  postDetail: IPost;
}
interface IChildrenPost {
  dataType: string;
  data: Record<string, any>;
}
interface ImageUri {
  uri: string;
}
export default function PostList({ postDetail }: IPostList) {
  const {
    postId,
    data,
    dataType,
    myReactions,
    reactionCount,
    commentsCount,
    postedUserId = '',
    updatedAt,
    editedAt,
    createdAt,
    user,
    targetType,
    targetId,
    childrenPosts,
  } = postDetail ?? {};

  const [isLike, setIsLike] = useState(false);
  const [likeReaction, setLikeReaction] = useState<number>(0);
  const [communityName, setCommunityName] = useState('');
  const [imagePosts, setImagePosts] = useState<string[]>([]);

  const [imagePostsFull, setImagePostsFull] = useState<ImageUri[]>([]);
  // console.log('imagePostsFull: ', imagePostsFull);
  const [videoPosts, setVideoPosts] = useState<IChildrenPost[]>([]);
  const [visibleFullImage, setIsVisibleFullImage] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  // console.log('videoPosts: ', videoPosts);
  // console.log('imagePosts: ', imagePosts);

  // console.log('childrenPosts: ', childrenPosts);
  // console.log('reactionCount: ', reactionCount);
  const getPostInfo = useCallback(async () => {
    const response = await Promise.all(
      childrenPosts.map(async (id: string) => {
        const { data: post } = await getPostById(id);
        return { dataType: post.dataType, data: post.data };
      })
    );

    response.forEach((item) => {
      if (item.dataType === 'image') {
        setImagePosts((prev) => [
          ...prev,
          `https://api.amity.co/api/v3/files/${item?.data.fileId}/download?size=medium`,
        ]);
        setImagePostsFull((prev) => [
          ...prev,
          {
            uri: `https://api.amity.co/api/v3/files/${item?.data.fileId}/download?size=large`,
          },
        ]);
      } else if (item.dataType === 'video') {
        setVideoPosts((prev) => [...prev, item.data]);
      }
    });
  }, [childrenPosts]);

  // const getPostInfo = async () => {
  //   const response = await Promise.all(
  //     childrenPosts.map(async (postId: string) => {
  //       const post = await getPostById(postId);
  //       return post;
  //     })
  //   );
  //   console.log('response: ', response);
  // };
  useEffect(() => {
    if (myReactions.length > 0 && myReactions.includes('like')) {
      setIsLike(true);
    }
    if (reactionCount.like) {
      setLikeReaction(reactionCount.like);
    }
    if (targetType === 'community' && targetId) {
      getCommunityInfo(targetId);
    }
    if (childrenPosts.length > 0) {
      getPostInfo();
    }
  }, [
    myReactions,
    reactionCount,
    targetType,
    targetId,
    childrenPosts,
    getPostInfo,
  ]);

  function renderLikeText(likeNumber: number | undefined): string {
    if (!likeNumber) {
      return '';
    } else if (likeNumber === 1) {
      return 'like';
    } else {
      return 'likes';
    }
  }
  function renderCommentText(commentNumber: number | undefined): string {
    if (commentNumber === 0) {
      return '';
    } else if (commentNumber === 1) {
      return 'comment';
    } else {
      return 'comments';
    }
  }

  function getTimeDifference(timestamp: string): string {
    // Convert the timestamp string to a Date object
    const timestampDate = Date.parse(timestamp);

    // Get the current date and time
    const currentDate = Date.now();

    // Calculate the difference in milliseconds
    const differenceMs = currentDate - timestampDate;

    const differenceYear = Math.floor(
      differenceMs / (1000 * 60 * 60 * 24 * 365)
    );
    const differenceDay = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    const differenceHour = Math.floor(differenceMs / (1000 * 60 * 60));
    const differenceMinutes = Math.floor(differenceMs / (1000 * 60));
    const differenceSec = Math.floor(differenceMs / 1000);

    if (differenceSec < 60) {
      return 'Just now';
    } else if (differenceMinutes < 60) {
      return (
        differenceMinutes +
        ` ${differenceMinutes === 1 ? 'min ago' : 'mins ago'}`
      );
    } else if (differenceHour < 24) {
      return (
        differenceHour + ` ${differenceHour === 1 ? 'hour ago' : 'hours ago'}`
      );
    } else if (differenceDay < 365) {
      return (
        (differenceDay !== 1 ? differenceDay : '') +
        ` ${differenceDay === 1 ? 'Yesterday' : 'days ago'}`
      );
    } else {
      return (
        differenceYear + ` ${differenceYear === 1 ? 'year ago' : 'years ago'}`
      );
    }
  }
  async function addReactionToPost() {
    setIsLike((prev) => !prev);
    if (isLike && likeReaction) {
      setLikeReaction(likeReaction - 1);
      const isRemovePost = await removePostReaction(postId, 'like');
      console.log('isRemovePost: ', isRemovePost);
    } else {
      setLikeReaction(likeReaction + 1);
      const isLikePost = await addPostReaction(postId, 'like');
      console.log('isLikePost: ', isLikePost);
    }
  }

  async function getCommunityInfo(id: string) {
    const { data: community } = await getCommunityById(id);
    setCommunityName(community.data.displayName);
  }

  function onClickImage(index: number): void {
    setIsVisibleFullImage(true);
    setImageIndex(index);
  }

  function renderMediaPost(): ReactNode {
    let imageStyle: StyleProp<ImageStyle> | StyleProp<ImageStyle>[] =
      styles.imageLargePost;
    let colStyle: StyleProp<ImageStyle> = styles.col2;

    const imageElement: ReactElement[] = imagePosts.map(
      (item: string, index: number) => {
        if (imagePosts.length === 1) {
          imageStyle = styles.imageLargePost;
          colStyle = styles.col6;
        } else if (imagePosts.length === 2) {
          colStyle = styles.col3;
          if (index === 0) {
            imageStyle = [styles.imageLargePost, styles.imageMarginRight];
          } else {
            imageStyle = [styles.imageLargePost, styles.imageMarginLeft];
          }
        } else if (imagePosts.length === 3) {
          switch (index) {
            case 0:
              colStyle = styles.col6;
              imageStyle = [styles.imageMediumPost, styles.imageMarginBottom];
              break;
            case 1:
              colStyle = styles.col3;
              imageStyle = [
                styles.imageMediumPost,
                styles.imageMarginTop,
                styles.imageMarginRight,
              ];
              break;
            case 2:
              colStyle = styles.col3;
              imageStyle = [
                styles.imageMediumPost,
                styles.imageMarginTop,
                styles.imageMarginLeft,
              ];
              break;

            default:
              break;
          }
        } else {
          switch (index) {
            case 0:
              colStyle = styles.col6;
              imageStyle = [
                styles.imageMediumLargePost,
                styles.imageMarginBottom,
              ];
              break;
            case 1:
              colStyle = styles.col2;
              imageStyle = [
                styles.imageSmallPost,
                styles.imageMarginTop,
                styles.imageMarginRight,
              ];
              break;
            case 2:
              colStyle = styles.col2;
              imageStyle = [
                styles.imageSmallPost,
                styles.imageMarginTop,
                styles.imageMarginLeft,
                styles.imageMarginRight,
              ];
              break;
            case 3:
              colStyle = styles.col2;
              imageStyle = [
                styles.imageSmallPost,
                styles.imageMarginTop,
                styles.imageMarginLeft,
              ];
              break;
            default:
              break;
          }
        }
        return (
          <View style={colStyle}>
            <TouchableWithoutFeedback onPress={() => onClickImage(index)}>
              <View>
                <Image
                  style={imageStyle}
                  source={{
                    uri: item,
                  }}
                />
                {index === 3 && imagePosts.length > 4 && (
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText}>{`+ ${
                      imagePosts.length - 3
                    }`}</Text>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        );
      }
    );

    if (imageElement.length < 3) {
      return (
        <View style={styles.imagesWrap}>
          <View style={styles.row}>{imageElement}</View>
        </View>
      );
    } else if (imageElement.length === 3) {
      console.log('imageElement.length: ', imageElement.length);
      return (
        <View style={styles.imagesWrap}>
          <View style={styles.row}>{imageElement.slice(0, 1)}</View>
          <View style={styles.row}>{imageElement.slice(1, 3)}</View>
        </View>
      );
    } else {
      return (
        <View style={styles.imagesWrap}>
          <View style={styles.row}>{imageElement.slice(0, 1)}</View>
          <View style={styles.row}>{imageElement.slice(1, 4)}</View>
        </View>
      );
    }
  }
  // console.log('reactionCount: ', data.text + reactionCount.like);
  return (
    <View key={postId} style={styles.postWrap}>
      <View style={styles.headerSection}>
        {user?.avatarFileId ? (
          <Image
            style={styles.avatar}
            source={{
              uri: `https://api.amity.co/api/v3/files/${user?.avatarFileId}/download`,
            }}
          />
        ) : (
          <View style={styles.avatar}>
            <SvgXml xml={personXml} width="20" height="16" />
          </View>
        )}

        <View>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>{user?.displayName}</Text>
            {communityName && (
              <>
                <SvgXml
                  style={styles.arrow}
                  xml={arrowXml}
                  width="8"
                  height="8"
                />
                <Text style={styles.headerText}>{communityName}</Text>
              </>
            )}
          </View>

          <Text style={styles.headerTextTime}>
            {getTimeDifference(createdAt)}
          </Text>
        </View>
      </View>
      <View style={styles.bodySection}>
        {data.text && <Text style={styles.bodyText}>{data.text}</Text>}

        {imagePosts.length > 0 && renderMediaPost()}
      </View>
      {likeReaction === 0 && commentsCount === 0 ? (
        ''
      ) : (
        <View style={styles.countSection}>
          {likeReaction ? (
            <Text style={styles.likeCountText}>
              {likeReaction} {renderLikeText(likeReaction)}
            </Text>
          ) : (
            <Text />
          )}
          {commentsCount > 0 && (
            <Text style={styles.commentCountText}>
              {commentsCount > 0 && commentsCount}{' '}
              {renderCommentText(commentsCount)}
            </Text>
          )}
        </View>
      )}

      <View style={styles.actionSection}>
        <TouchableOpacity
          onPress={() => addReactionToPost()}
          style={styles.likeBtn}
        >
          {isLike ? (
            <SvgXml xml={likedXml} width="20" height="16" />
          ) : (
            <SvgXml xml={likeXml} width="20" height="16" />
          )}

          <Text style={isLike ? styles.likedText : styles.btnText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => getPostInfo()}
          style={styles.commentBtn}
        >
          <SvgXml xml={commentXml} width="20" height="16" />
          <Text style={styles.btnText}>Comment</Text>
        </TouchableOpacity>
      </View>
      <ImageView
        images={imagePostsFull}
        imageIndex={imageIndex}
        visible={visibleFullImage}
        onRequestClose={() => setIsVisibleFullImage(false)}
      />
    </View>
  );
}
