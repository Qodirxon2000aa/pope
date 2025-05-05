import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import ContentLoader from 'react-content-loader';
import VideoData from '../data/VideoData';

// Neogothic Color Palette
const colors = {
  background: {
    primary: '#0A0A0A',
    secondary: '#121212',
    tertiary: '#1A1A1A',
    stainedGlass: 'rgba(20, 20, 20, 0.85)',
  },
  accent: {
    primary: '#8B0000',
    secondary: '#5E0000',
    highlight: '#C00000',
    gold: '#D4AF37',
    silver: '#C0C0C0',
  },
  text: {
    primary: '#E0E0E0',
    secondary: '#A0A0A0',
    highlight: '#FFFFFF',
    gold: '#D4AF37',
  },
  border: {
    primary: '#333',
    highlight: '#5E0000',
    gold: '#D4AF37',
  },
};

// Ornate Decorative Elements
const GothicDecorations = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;

  .fleur-de-lis-top-left {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, ${colors.accent.gold} 0%, transparent 70%);
    opacity: 0.7;
    clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .fleur-de-lis-top-right {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, ${colors.accent.gold} 0%, transparent 70%);
    opacity: 0.7;
    clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .bottom-border {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 12px;
    background: linear-gradient(90deg, transparent, ${colors.accent.gold}, transparent);
    mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='12'><path d='M0,6 Q75,12 150,6 T300,6' fill='none' stroke='black'/></svg>");
    opacity: 0.3;
    transition: opacity 0.3s ease;
  }
`;

// Styled Components
const PageContainer = styled.div`
  padding: ${({ isMobile }) => (isMobile ? '14px' : '20px')};
  min-height: 100vh;
  background: ${colors.background.primary};
  box-shadow: inset 0 0 15px ${colors.accent.secondary};
  font-family: 'UnifrakturCook', 'Old English Text MT', 'Times New Roman', serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: ${({ isMobile }) => (isMobile ? '16px' : '24px')};
  flex-wrap: wrap;
`;

const MainContent = styled.div`
  flex-basis: 850px;
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(139, 0, 0, 0.3);
  border: 1px solid ${colors.border.highlight};

  iframe {
    width: 100%;
    height: 100%;
  }
`;

const StainedGlassOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(139, 0, 0, 0.1) 0%,
    rgba(94, 0, 0, 0.2) 50%,
    rgba(139, 0, 0, 0.1) 100%
  );
  pointer-events: none;
  z-index: 1;
`;

const VideoInfo = styled.div`
  background-color: ${colors.background.tertiary};
  border-radius: 12px;
  padding: ${({ isMobile }) => (isMobile ? '12px' : '16px')};
  margin-bottom: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(139, 0, 0, 0.3);
  border: 1px solid ${colors.border.highlight};
  position: relative;
`;

const VideoTitle = styled.h1`
  font-size: ${({ isMobile }) => (isMobile ? '18px' : '20px')};
  font-weight: 700;
  color: ${colors.text.gold};
  margin-bottom: 8px;
  text-shadow: 1px 1px 2px ${colors.background.primary},
               -1px -1px 2px ${colors.background.primary},
               0 0 8px ${colors.accent.gold};
`;

const MetaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: ${({ isMobile }) => (isMobile ? '12px' : '14px')};
  color: ${colors.text.secondary};
`;

const ChannelName = styled.span`
  font-weight: 600;
  color: ${colors.text.primary};
`;

const Meta = styled.div`
  display: flex;
  gap: 8px;
`;

const Description = styled.div`
  padding: 12px;
  background-color: ${colors.background.stainedGlass};
  border-radius: 12px;
  font-size: ${({ isMobile }) => (isMobile ? '12px' : '14px')};
  color: ${colors.text.secondary};
`;

const CommentsSection = styled.div`
  background-color: ${colors.background.tertiary};
  border-radius: 12px;
  padding: ${({ isMobile }) => (isMobile ? '12px' : '16px')};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(139, 0, 0, 0.3);
  border: 1px solid ${colors.border.highlight};
  position: relative;
`;

const CommentsTitle = styled.h3`
  font-size: ${({ isMobile }) => (isMobile ? '14px' : '16px')};
  font-weight: 600;
  color: ${colors.text.gold};
  margin-bottom: 16px;
  text-shadow: 0 0 4px ${colors.accent.gold};
`;

const CommentInputWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
`;

const AvatarPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle, ${colors.accent.gold} 0%, ${colors.accent.secondary} 100%);
  margin-right: 12px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid ${colors.border.gold};
  font-size: ${({ isMobile }) => (isMobile ? '12px' : '14px')};
  color: ${colors.text.primary};
  background-color: ${colors.background.secondary};
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: ${colors.accent.gold};
    box-shadow: 0 0 8px ${colors.accent.gold};
  }
`;

const NoComments = styled.div`
  color: ${colors.text.secondary};
  text-align: center;
  font-size: ${({ isMobile }) => (isMobile ? '12px' : '14px')};
`;

const Sidebar = styled.div`
  flex-basis: 300px;
  flex-grow: 1;
`;

const RelatedTitle = styled.h3`
  font-size: ${({ isMobile }) => (isMobile ? '14px' : '16px')};
  font-weight: 600;
  color: ${colors.text.gold};
  margin-bottom: 12px;
  text-shadow: 0 0 4px ${colors.accent.gold};
`;

const RelatedVideoCard = styled.div`
  display: flex;
  margin-bottom: 12px;
  background-color: ${colors.background.tertiary};
  border-radius: 12px;
  padding: 8px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(139, 0, 0, 0.3);
  border: 1px solid ${colors.border.highlight};
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.8),
                0 5px 15px rgba(139, 0, 0, 0.6),
                0 3px 10px rgba(212, 175, 55, 0.3);
    border-color: ${colors.accent.gold};

    .thumbnail-img {
      transform: scale(1.05);
    }

    .related-title {
      color: ${colors.text.highlight};
    }

    .related-channel,
    .related-meta {
      color: ${colors.text.gold};
    }
  }
`;

const RelatedThumbnail = styled.div`
  width: 168px;
  height: 94px;
  background-color: #000;
  margin-right: 8px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
`;

const RelatedInfo = styled.div`
  flex: 1;
`;

const RelatedVideoTitle = styled.div`
  font-size: ${({ isMobile }) => (isMobile ? '12px' : '14px')};
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 0 2px ${colors.background.primary};
`;

const RelatedChannel = styled.div`
  font-size: ${({ isMobile }) => (isMobile ? '10px' : '12px')};
  color: ${colors.text.secondary};
`;

const RelatedMeta = styled.div`
  font-size: ${({ isMobile }) => (isMobile ? '10px' : '12px')};
  color: ${colors.text.secondary};
`;

const NotFound = styled.div`
  padding: 20px;
  text-align: center;
  background-color: ${colors.background.tertiary};
  min-height: 100vh;
  color: ${colors.text.gold};
  font-size: ${({ isMobile }) => (isMobile ? '16px' : '20px')};
  font-family: 'UnifrakturCook', 'Old English Text MT', 'Times New Roman', serif;
  box-shadow: inset 0 0 15px ${colors.accent.secondary};
`;

// Skeleton Loaders
const VideoPlayerSkeleton = ({ isMobile }) => (
  <ContentLoader
    speed={2}
    width={850}
    height={478}
    viewBox="0 0 850 478"
    backgroundColor={colors.background.tertiary}
    foregroundColor={colors.border.primary}
  >
    <rect x="0" y="0" rx="12" ry="12" width="850" height="478" />
  </ContentLoader>
);

const VideoInfoSkeleton = ({ isMobile }) => (
  <ContentLoader
    speed={2}
    width={850}
    height={200}
    viewBox="0 0 850 200"
    backgroundColor={colors.background.tertiary}
    foregroundColor={colors.border.primary}
  >
    <rect x="16" y="16" rx="4" ry="4" width="600" height="20" />
    <rect x="16" y="48" rx="4" ry="4" width="200" height="14" />
    <rect x="650" y="48" rx="4" ry="4" width="150" height="14" />
    <rect x="28" y="80" rx="8" ry="8" width="794" height="100" />
  </ContentLoader>
);

const CommentsSkeleton = ({ isMobile }) => (
  <ContentLoader
    speed={2}
    width={850}
    height={150}
    viewBox="0 0 850 150"
    backgroundColor={colors.background.tertiary}
    foregroundColor={colors.border.primary}
  >
    <rect x="16" y="16" rx="4" ry="4" width="150" height="16" />
    <circle cx="36" cy="64" r="20" />
    <rect x="60" y="52" rx="8" ry="8" width="762" height="24" />
    <rect x="16" y="100" rx="4" ry="4" width="200" height="14" />
  </ContentLoader>
);

const RelatedVideoSkeleton = ({ isMobile }) => (
  <ContentLoader
    speed={2}
    width={300}
    height={94}
    viewBox="0 0 300 94"
    backgroundColor={colors.background.tertiary}
    foregroundColor={colors.border.primary}
  >
    <rect x="8" y="8" rx="8" ry="8" width="168" height="78" />
    <rect x="184" y="8" rx="4" ry="4" width="100" height="14" />
    <rect x="184" y="28" rx="4" ry="4" width="80" height="14" />
    <rect x="184" y="48" rx="4" ry="4" width="60" height="12" />
    <rect x="184" y="68" rx="4" ry="4" width="100" height="12" />
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
      <NotFound isMobile={isMobile}>
        Video not found
      </NotFound>
    );
  }

  if (isLoading) {
    return (
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
    );
  }

  return (
    <PageContainer isMobile={isMobile}>
      <ContentWrapper isMobile={isMobile}>
        <MainContent>
          <VideoPlayer>
            <GothicDecorations>
              <div className="fleur-de-lis-top-left" />
              <div className="fleur-de-lis-top-right" />
              <div className="bottom-border" />
            </GothicDecorations>
            <StainedGlassOverlay />
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.snippet.title}
            ></iframe>
          </VideoPlayer>
          <VideoInfo isMobile={isMobile}>
            <GothicDecorations>
              <div className="fleur-de-lis-top-left" />
              <div className="fleur-de-lis-top-right" />
              <div className="bottom-border" />
            </GothicDecorations>
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
            <GothicDecorations>
              <div className="fleur-de-lis-top-left" />
              <div className="fleur-de-lis-top-right" />
              <div className="bottom-border" />
            </GothicDecorations>
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
                <GothicDecorations>
                  <div className="fleur-de-lis-top-left" />
                  <div className="fleur-de-lis-top-right" />
                  <div className="bottom-border" />
                </GothicDecorations>
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
  );
};

export default VideoPage;