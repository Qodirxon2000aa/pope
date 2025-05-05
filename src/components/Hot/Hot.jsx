import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
const HotContainer = styled.div`
  padding: ${({ isMobile }) => (isMobile ? '16px' : '24px')};
  min-height: 100vh;
  background: ${colors.background.primary};
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  width: calc(100% - var(--sidebar-width, 0px));
  margin-right: var(--sidebar-width, 0px);
  transition: margin-right 0.5s ease, width 0.5s ease, transform 0.5s ease;
  transform: ${({ isMobile }) => (isMobile ? 'scale(1)' : 'var(--content-scale, 1)')};
`;

const HotHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${({ isMobile }) => (isMobile ? '0 12px 16px' : '0 20px 20px')};
  margin-bottom: 24px;
  border-bottom: 2px solid ${colors.border.cyan};
  position: relative;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, ${colors.accent.cyan}, transparent);
    opacity: 0.5;
  }
`;

const HotTitle = styled.h1`
  font-size: ${({ isMobile }) => (isMobile ? '22px' : '28px')};
  font-weight: 700;
  color: ${colors.text.primary};
  margin-bottom: 16px;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }

  &:hover {
    color: ${colors.accent.cyan};
    text-shadow: 0 0 8px ${colors.accent.cyan};
    animation: pulse 1.5s infinite;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  border-radius: 24px;
  border: 2px solid ${colors.border.cyan};
  background-color: ${({ active }) => (active ? colors.accent.cyan : colors.background.secondary)};
  color: ${({ active }) => (active ? colors.text.highlight : colors.text.primary)};
  font-size: ${({ isMobile }) => (isMobile ? '13px' : '14px')};
  font-weight: 600;
  font-family: 'Orbitron', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover,
  &:focus {
    background-color: ${colors.accent.cyan};
    color: ${colors.text.highlight};
    box-shadow: 0 0 12px ${colors.accent.cyan};
    animation: glow 1.5s infinite;
  }

  &:focus {
    outline: none;
    border-color: ${colors.accent.magenta};
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ isMobile }) => (isMobile ? '16px' : '24px')};
  padding: ${({ isMobile }) => (isMobile ? '0 12px' : '0 20px')};
`;

const VideoCard = styled.div`
  position: relative;
  background-color: ${colors.background.secondary};
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid ${colors.border.primary};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px) scale(1.03);
    border-color: ${colors.accent.cyan};
    box-shadow: 0 0 12px ${colors.accent.cyan};
    animation: glow 1.5s infinite;

    .thumbnail-img {
      transform: scale(1.05);
    }

    .play-button {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.1);
    }

    .title-text {
      color: ${colors.accent.cyan};
    }

    .channel-name {
      color: ${colors.text.primary};
    }

    .metadata {
      color: ${colors.text.primary};
    }
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-bottom: 2px solid ${colors.border.primary};
`;

const ThumbnailFrame = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 2px solid ${colors.border.cyan};
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  transition: border-color 0.3s ease;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, ${colors.accent.cyan} 0%, ${colors.accent.magenta} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: all 0.3s ease;

  &:hover,
  &:focus {
    opacity: 1;
    box-shadow: 0 0 15px ${colors.accent.cyan};
    animation: pulse 1.5s infinite;
  }

  &:after {
    content: '';
    width: 0;
    height: 0;
    border-top: 14px solid transparent;
    border-left: 24px solid ${colors.text.highlight};
    border-bottom: 14px solid transparent;
    margin-left: 6px;
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

const DurationBadge = styled.div`
  position: absolute;
  bottom: 14px;
  right: 14px;
  background-color: ${colors.background.primary};
  color: ${colors.text.primary};
  padding: 4px 10px;
  border-radius: 6px;
  font-size: ${({ isMobile }) => (isMobile ? '11px' : '12px')};
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  border: 2px solid ${colors.border.cyan};
  transition: all 0.3s ease;

  ${VideoCard}:hover & {
    background-color: ${colors.accent.cyan};
    color: ${colors.text.highlight};
  }
`;

const VideoInfo = styled.div`
  padding: ${({ isMobile }) => (isMobile ? '12px' : '16px')};
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
`;

const Title = styled.h3`
  font-size: ${({ isMobile }) => (isMobile ? '16px' : '18px')};
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 10px;
  font-family: 'Poppins', sans-serif;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  transition: color 0.3s ease;
`;

const Channel = styled.div`
  font-size: ${({ isMobile }) => (isMobile ? '13px' : '14px')};
  color: ${colors.text.secondary};
  font-family: 'Poppins', sans-serif;
  margin-bottom: 8px;
  transition: color 0.3s ease;
`;

const Meta = styled.div`
  display: flex;
  gap: 10px;
  font-size: ${({ isMobile }) => (isMobile ? '12px' : '13px')};
  color: ${colors.text.secondary};
  font-family: 'Poppins', sans-serif;

  svg {
    width: 14px;
    height: 14px;
    stroke: ${colors.text.secondary};
    stroke-width: 2;
    transition: stroke 0.3s ease;
  }

  ${VideoCard}:hover & {
    svg {
      stroke: ${colors.accent.cyan};
    }
  }
`;

// Skeleton Loader Component
const VideoCardSkeleton = ({ isMobile }) => (
  <ContentLoader
    speed={2}
    width={300}
    height={isMobile ? 260 : 280}
    viewBox="0 0 300 280"
    backgroundColor={colors.background.tertiary}
    foregroundColor={colors.border.primary}
  >
    <rect x="0" y="0" rx="8" ry="8" width="300" height="168" />
    <rect x="12" y="184" rx="4" ry="4" width="220" height="18" />
    <rect x="12" y="208" rx="4" ry="4" width="160" height="14" />
    <rect x="12" y="236" rx="4" ry="4" width="140" height="12" />
    <rect x="12" y="260" rx="4" ry="4" width="100" height="12" />
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

// Mock Data Generator
const generateHotVideos = () => {
  return VideoData.map((video, index) => {
    const isTrending = index % 3 === 0;
    const viewCount = isTrending ? `${Math.floor(Math.random() * 500) + 500}K` : video.statistics.viewCount;
    return {
      ...video,
      trending: isTrending ? 1 : 0,
      statistics: {
        ...video.statistics,
        viewCount: viewCount,
      },
      contentDetails: {
        duration: `PT${Math.floor(Math.random() * 10 + 1)}M${Math.floor(Math.random() * 60)}S`,
      },
    };
  });
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

const Hot = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('trending');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const filteredVideos = React.useMemo(() => {
    if (!videos.length) return [];
    const sorted = [...videos];
    switch (filter) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt));
      case 'popular':
        return sorted.sort(
          (a, b) => parseInt(b.statistics.viewCount.replace('K', '')) - parseInt(a.statistics.viewCount.replace('K', ''))
        );
      case 'trending':
      default:
        return sorted.sort((a, b) => {
          if (a.trending !== b.trending) return b.trending - a.trending;
          return parseInt(b.statistics.viewCount.replace('K', '')) - parseInt(a.statistics.viewCount.replace('K', ''));
        });
    }
  }, [videos, filter]);

  const fetchVideos = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const hotVideos = generateHotVideos();
    setVideos(hotVideos);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <GlobalStyles>
      <HotContainer isMobile={isMobile}>
        <HotHeader isMobile={isMobile}>
          <HotTitle isMobile={isMobile}>Hot Leaks</HotTitle>
          <FilterButtons>
            <FilterButton active={filter === 'trending'} onClick={() => setFilter('trending')} isMobile={isMobile} tabIndex={0}>
              Trending
            </FilterButton>
            <FilterButton active={filter === 'newest'} onClick={() => setFilter('newest')} isMobile={isMobile} tabIndex={0}>
              Newest
            </FilterButton>
            <FilterButton active={filter === 'popular'} onClick={() => setFilter('popular')} isMobile={isMobile} tabIndex={0}>
              Most Popular
            </FilterButton>
          </FilterButtons>
        </HotHeader>

        <VideoGrid isMobile={isMobile}>
          {isLoading
            ? Array(4)
                .fill()
                .map((_, index) => <VideoCardSkeleton key={`skeleton-${index}`} isMobile={isMobile} />)
            : filteredVideos.map((video) => (
                <Link
                  to={`/video/${video.id}`}
                  key={video.id}
                  style={{ textDecoration: 'none' }}
                  aria-label={`Watch ${video.snippet.title} by ${video.snippet.channelTitle}`}
                >
                  <VideoCard>
                    <HolographicOverlay />
                    <ThumbnailContainer>
                      <ThumbnailFrame>
                        <Thumbnail
                          className="thumbnail-img"
                          src={video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                          onError={(e) => {
                            e.target.src = 'https://i.ytimg.com/vi/default.jpg';
                          }}
                        />
                      </ThumbnailFrame>
                      <PlayButton className="play-button" tabIndex={0} />
                      <DurationBadge isMobile={isMobile}>{formatDuration(video.contentDetails.duration)}</DurationBadge>
                    </ThumbnailContainer>
                    <VideoInfo isMobile={isMobile}>
                      <Title className="title-text" isMobile={isMobile}>
                        {video.snippet.title}
                      </Title>
                      <Channel className="channel-name" isMobile={isMobile}>
                        {video.snippet.channelTitle}
                      </Channel>
                      <Meta className="metadata" isMobile={isMobile}>
                        <span>
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          {formatViews(video.statistics.viewCount)}
                        </span>
                        <span>
                          <svg viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {formatDate(video.snippet.publishedAt)}
                        </span>
                      </Meta>
                    </VideoInfo>
                  </VideoCard>
                </Link>
              ))}
        </VideoGrid>
      </HotContainer>
    </GlobalStyles>
  );
};

export default Hot;