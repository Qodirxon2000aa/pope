import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import ContentLoader from 'react-content-loader';
import VideoData from '../data/VideoData';

// Futuristic Color Palette
const colors = {
  background: {
    primary: '#0A1322', // Dark navy
    secondary: '#1B263B', // Darker navy
    tertiary: '#2A3A5A', // Medium navy
  },
  accent: {
    cyan: '#00D4FF', // Neon cyan
    magenta: '#FF007A', // Neon magenta
    highlight: '#00B7EB', // Light cyan
  },
  text: {
    primary: '#F5F7FA', // Soft white
    secondary: '#A3BFFA', // Light blue-gray
    highlight: '#FFFFFF', // Pure white
  },
  border: {
    primary: '#2A3A5A', // Navy border
    cyan: '#00D4FF', // Neon cyan border
  },
};

// Keyframes for animations
const keyframes = `
  @keyframes glow {
    0% { box-shadow: 0 0 5px ${colors.accent.cyan}, 0 0 10px ${colors.accent.cyan}; }
    50% { box-shadow: 0 0 10px ${colors.accent.cyan}, 0 0 20px ${colors.accent.cyan}; }
    100% { box-shadow: 0 0 5px ${colors.accent.cyan}, 0 0 10px ${colors.accent.cyan}; }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

// Inject keyframes globally
const GlobalStyles = styled.div`
  ${keyframes}
`;

// Styled Components
const PageContainer = styled.div`
  padding: ${({ isMobile }) => (isMobile ? '12px' : '16px')};
  min-height: 100vh;
  background: ${colors.background.primary};
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  width: calc(100% - var(--sidebar-width, 0px));
  margin-right: var(--sidebar-width, 0px);
  display: flex;
  flex-direction: row;
  gap: ${({ isMobile }) => (isMobile ? '12px' : '24px')};
  flex-wrap: wrap;
  transition: margin-right 0.5s ease, width 0.5s ease, transform 0.5s ease;
  transform: ${({ isMobile }) => (isMobile ? 'scale(1)' : 'var(--content-scale, 1)')};
`;

const MainContent = styled.div`
  flex-basis: 900px;
  flex-grow: 1;
`;

const VideoPlayer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #000;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  position: relative;
  border: 2px solid ${colors.border.primary};
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  iframe {
    width: 100%;
    height: 100%;
  }

  &:hover {
    border-color: ${colors.accent.cyan};
    box-shadow: 0 0 12px ${colors.accent.cyan};
    animation: glow 1.5s infinite;
  }
`;

const HolographicOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 212, 255, 0.1) 0%,
    rgba(255, 0, 122, 0.1) 50%,
    rgba(0, 212, 255, 0.1) 100%
  );
  pointer-events: none;
  z-index: 1;
  opacity: 0.5;
`;

const VideoInfo = styled.div`
  background-color: ${colors.background.secondary};
  border-radius: 12px;
  padding: ${({ isMobile }) => (isMobile ? '12px' : '20px')};
  margin-bottom: 16px;
  border: 2px solid ${colors.border.primary};
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    border-color: ${colors.accent.cyan};
    box-shadow: 0 0 12px ${colors.accent.cyan};
  }
`;

const VideoTitle = styled.h1`
  font-size: ${({ isMobile }) => (isMobile ? '18px' : '22px')};
  font-weight: 700;
  color: ${colors.text.primary};
  margin-bottom: 12px;
  line-height: 1.3;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;

  &:hover {
    color: ${colors.accent.cyan};
  }
`;

const MetaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: ${({ isMobile }) => (isMobile ? '13px' : '14px')};
  color: ${colors.text.secondary};
`;

const ChannelName = styled.span`
  font-weight: 600;
  color: ${colors.text.primary};
  transition: color 0.3s ease;

  &:hover {
    color: ${colors.accent.cyan};
  }
`;

const Meta = styled.div`
  display: flex;
  gap: 8px;
`;

const Description = styled.div`
  padding: 12px;
  background-color: ${colors.background.tertiary};
  border-radius: 12px;
  font-size: ${({ isMobile }) => (isMobile ? '13px' : '14px')};
  color: ${colors.text.secondary};
  line-height: 1.6;
  border: 1px solid ${colors.border.primary};
  transition: border-color 0.3s ease;

  &:hover {
    border-color: ${colors.accent.cyan};
  }
`;

const CommentsSection = styled.div`
  background-color: ${colors.background.secondary};
  border-radius: 12px;
  padding: ${({ isMobile }) => (isMobile ? '12px' : '20px')};
  border: 2px solid ${colors.border.primary};
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    border-color: ${colors.accent.cyan};
    box-shadow: 0 0 12px ${colors.accent.cyan};
  }
`;

const CommentsTitle = styled.h3`
  font-size: ${({ isMobile }) => (isMobile ? '16px' : '18px')};
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 16px;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.5px;
`;

const CommentInputWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
`;

const AvatarPlaceholder = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: radial-gradient(circle, ${colors.accent.cyan} 0%, ${colors.accent.magenta} 100%);
  margin-right: 12px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    animation: pulse 1.5s infinite;
  }
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border-radius: 12px;
  border: 2px solid ${colors.border.primary};
  font-size: ${({ isMobile }) => (isMobile ? '13px' : '14px')};
  color: ${colors.text.primary};
  background-color: ${colors.background.tertiary};
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: ${colors.accent.cyan};
    box-shadow: 0 0 8px ${colors.accent.cyan};
  }
`;

const NoComments = styled.div`
  color: ${colors.text.secondary};
  text-align: center;
  font-size: ${({ isMobile }) => (isMobile ? '13px' : '14px')};
`;

const Sidebar = styled.div`
  flex-basis: 320px;
  flex-grow: 1;
`;

const RelatedTitle = styled.h3`
  font-size: ${({ isMobile }) => (isMobile ? '16px' : '18px')};
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 16px;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.5px;
`;

const RelatedVideoCard = styled.div`
  display: flex;
  margin-bottom: 16px;
  background-color: ${colors.background.secondary};
  border-radius: 12px;
  padding: 10px;
  border: 2px solid ${colors.border.primary};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: ${colors.accent.cyan};
    box-shadow: 0 0 12px ${colors.accent.cyan};
    animation: glow 1.5s infinite;

    .thumbnail-img {
      transform: scale(1.05);
      border-color: ${colors.accent.cyan};
    }

    .related-title {
      color: ${colors.accent.cyan};
    }

    .related-channel,
    .related-meta {
      color: ${colors.text.primary};
    }
  }
`;

const RelatedThumbnail = styled.div`
  width: 168px;
  height: 94px;
  background-color: #000;
  margin-right: 12px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  border: 2px solid ${colors.border.primary};
  transition: transform 0.3s ease, border-color 0.3s ease;
`;

const RelatedInfo = styled.div`
  flex: 1;
`;

const RelatedVideoTitle = styled.div`
  font-size: ${({ isMobile }) => (isMobile ? '13px' : '14px')};
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
`;

const RelatedChannel = styled.div`
  font-size: ${({ isMobile }) => (isMobile ? '12px' : '13px')};
  color: ${colors.text.secondary};
`;

const RelatedMeta = styled.div`
  font-size: ${({ isMobile }) => (isMobile ? '12px' : '13px')};
  color: ${colors.text.secondary};
`;

const NotFound = styled.div`
  padding: 20px;
  text-align: center;
  background-color: ${colors.background.primary};
  min-height: 100vh;
  color: ${colors.text.primary};
  font-size: ${({ isMobile }) => (isMobile ? '16px' : '18px')};
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.5px;
`;

// Skeleton Loaders
const VideoPlayerSkeleton = ({ isMobile }) => (
  <ContentLoader
    speed={2}
    width={900}
    height={506}
    viewBox="0 0 900 506"
    backgroundColor={colors.background.tertiary}
    foregroundColor={colors.border.primary}
  >
    <rect x="0" y="0" rx="12" ry="12" width="900" height="506" />
  </ContentLoader>
);

const VideoInfoSkeleton = ({ isMobile }) => (
  <ContentLoader
    speed={2}
    width={900}
    height={220}
    viewBox="0 0 900 220"
    backgroundColor={colors.background.tertiary}
    foregroundColor={colors.border.primary}
  >
    <rect x="20" y="20" rx="4" ry="4" width="650" height="18" />
    <rect x="20" y="50" rx="4" ry="4" width="220" height="14" />
    <rect x="700" y="50" rx="4" ry="4" width="180" height="14" />
    <rect x="32" y="90" rx="8" ry="8" width="856" height="120" />
  </ContentLoader>
);

const CommentsSkeleton = ({ isMobile }) => (
  <ContentLoader
    speed={2}
    width={900}
    height={160}
    viewBox="0 0 900 160"
    backgroundColor={colors.background.tertiary}
    foregroundColor={colors.border.primary}
  >
    <rect x="20" y="20" rx="4" ry="4" width="180" height="16" />
    <circle cx="40" cy="70" r="18" />
    <rect x="68" y="58" rx="8" ry="8" width="820" height="18" />
    <rect x="20" y="110" rx="4" ry="4" width="220" height="14" />
  </ContentLoader>
);

const RelatedVideoSkeleton = ({ isMobile }) => (
  <ContentLoader
    speed={2}
    width={320}
    height={94}
    viewBox="0 0 320 94"
    backgroundColor={colors.background.tertiary}
    foregroundColor={colors.border.primary}
  >
    <rect x="10" y="10" rx="8" ry="8" width="168" height="74" />
    <rect x="190" y="10" rx="4" ry="4" width="120" height="14" />
    <rect x="190" y="30" rx="4" ry="4" width="100" height="12" />
    <rect x="190" y="50" rx="4" ry="4" width="80" height="12" />
    <rect x="190" y="70" rx="4" ry="4" width="120" height="12" />
  </ContentLoader>
);

// Utility Functions
const formatDuration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  if (hours) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatViews = (count) => {
  if (count.includes('K')) return count;
  const num = parseInt(count.replace(/[^0-9]/g, ''));
  return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Custom Hook for Media Queries
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
};

// Mock Enhanced Video Data
const enhanceVideoData = (video) => {
  return {
    ...video,
    contentDetails: {
      duration: video.contentDetails?.duration || `PT${Math.floor(Math.random() * 10 + 1)}M${Math.floor(Math.random() * 60)}S`,
    },
  };
};

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const currentVideo = VideoData.find((v) => v.id === id);
      if (currentVideo) {
        const enhancedVideo = enhanceVideoData(currentVideo);
        setVideo(enhancedVideo);

        // Save to localStorage for History
        const history = JSON.parse(localStorage.getItem('videoHistory')) || [];
        if (!history.find((v) => v.id === enhancedVideo.id)) {
          history.unshift(enhancedVideo);
          localStorage.setItem('videoHistory', JSON.stringify(history));
        }

        // Set related videos
        const related = VideoData.filter((v) => v.id !== id)
          .slice(0, 5)
          .map(enhanceVideoData);
        setRelatedVideos(related);
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (!video && !isLoading) {
    return (
      <GlobalStyles>
        <NotFound isMobile={isMobile}>Video not found</NotFound>
      </GlobalStyles>
    );
  }

  if (isLoading) {
    return (
      <GlobalStyles>
        <PageContainer isMobile={isMobile}>
          <ContentWrapper isMobile={isMobile}>
            <MainContent>
              <VideoPlayerSkeleton isMobile={isMobile} />
              <VideoInfoSkeleton isMobile={isMobile} />
              <CommentsSkeleton isMobile={isMobile} />
            </MainContent>
            <Sidebar>
              <RelatedTitle isMobile={isMobile}>Related Videos</RelatedTitle>
              {Array(5)
                .fill()
                .map((_, index) => (
                  <RelatedVideoSkeleton key={`skeleton-${index}`} isMobile={isMobile} />
                ))}
            </Sidebar>
          </ContentWrapper>
        </PageContainer>
      </GlobalStyles>
    );
  }

  return (
    <GlobalStyles>
      <PageContainer isMobile={isMobile}>
        <ContentWrapper isMobile={isMobile}>
          <MainContent>
            <VideoPlayer>
              <HolographicOverlay />
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.snippet.title}
              ></iframe>
            </VideoPlayer>
            <VideoInfo isMobile={isMobile}>
              <VideoTitle isMobile={isMobile}>{video.snippet.title}</VideoTitle>
              <MetaContainer isMobile={isMobile}>
                <div>
                  <ChannelName>{video.snippet.channelTitle}</ChannelName>
                  <Meta> • {formatDuration(video.contentDetails.duration)}</Meta>
                </div>
                <Meta>
                  <span>{formatViews(video.statistics.viewCount)} views • </span>
                  <span>{formatDate(video.snippet.publishedAt)}</span>
                </Meta>
              </MetaContainer>
              <Description isMobile={isMobile}>
                <p>{video.snippet.description}</p>
              </Description>
            </VideoInfo>
            <CommentsSection isMobile={isMobile}>
              <CommentsTitle isMobile={isMobile}>Comments</CommentsTitle>
              <CommentInputWrapper>
                <AvatarPlaceholder />
                <CommentInput
                  type="text"
                  placeholder="Add a comment..."
                  isMobile={isMobile}
                />
              </CommentInputWrapper>
              <NoComments isMobile={isMobile}>No comments yet</NoComments>
            </CommentsSection>
          </MainContent>
          <Sidebar>
            <RelatedTitle isMobile={isMobile}>Related Videos</RelatedTitle>
            {relatedVideos.map((relVideo) => (
              <Link
                key={relVideo.id}
                to={`/video/${relVideo.id}`}
                style={{ textDecoration: 'none' }}
                aria-label={`Watch ${relVideo.snippet.title} by ${relVideo.snippet.channelTitle}`}
              >
                <RelatedVideoCard>
                  <RelatedThumbnail
                    className="thumbnail-img"
                    style={{
                      backgroundImage: `url(${relVideo.snippet.thumbnails.medium.url})`,
                    }}
                  />
                  <RelatedInfo>
                    <RelatedVideoTitle isMobile={isMobile} className="related-title">
                      {relVideo.snippet.title}
                    </RelatedVideoTitle>
                    <RelatedChannel isMobile={isMobile} className="related-channel">
                      {relVideo.snippet.channelTitle}
                    </RelatedChannel>
                    <RelatedMeta isMobile={isMobile} className="related-meta">
                      {formatViews(relVideo.statistics.viewCount)} views •{' '}
                      {formatDate(relVideo.snippet.publishedAt)}
                    </RelatedMeta>
                  </RelatedInfo>
                </RelatedVideoCard>
              </Link>
            ))}
          </Sidebar>
        </ContentWrapper>
      </PageContainer>
    </GlobalStyles>
  );
};

export default VideoPage;