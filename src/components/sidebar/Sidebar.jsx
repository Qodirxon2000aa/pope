import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HistoryIcon from '@mui/icons-material/History';
import XIcon from '@mui/icons-material/X';
import VideoData from '../data/VideoData';
import { gsap } from 'gsap';

// Gothic Color Palette
const colors = {
  background: {
    primary: '#0A0A0A',
    secondary: '#131313',
    tertiary: '#1C1C1C',
  },
  accent: {
    primary: '#8B0000',
    secondary: '#4A0404',
    highlight: '#B30000',
  },
  text: {
    primary: '#C0C0C0',
    secondary: '#767676',
    highlight: '#DEDEDE',
  },
  border: {
    primary: '#333',
    highlight: '#4A0404',
  },
};

const Navigation = () => {
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navbarRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e) => setIsMobile(e.matches);

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { opacity: 0, y: -70 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    );
    gsap.fromTo(
      sidebarRef.current,
      { opacity: 0, x: isMobile ? 0 : 70 },
      { opacity: 1, x: 0, duration: 1.4, ease: 'power3.out', delay: 0.3 }
    );
    gsap.fromTo(
      sidebarRef.current.querySelectorAll('li, a'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'back.out(1.2)', delay: 0.7 }
    );
  }, [isMobile]);

  const filteredVideos = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return VideoData.filter(
      (video) =>
        video.snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.snippet.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

  // Navbar Styles
  const navbarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: isMobile ? '10px 14px' : '14px 24px',
    background: `linear-gradient(180deg, ${colors.background.primary}, ${colors.background.secondary})`,
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    height: isMobile ? '52px' : '64px',
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.8), inset 0 0 15px ${colors.accent.secondary}`,
    borderBottom: `1px solid ${colors.accent.secondary}`,
  };

  const logoStyle = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: '700',
    color: colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '6px' : '8px',
    fontFamily: 'var(--font-heading)',
    textShadow: `0 0 8px ${colors.accent.primary}, 0 0 15px rgba(139, 0, 0, 0.5)`,
    letterSpacing: '1px',
    transition: 'all 0.4s ease',
  };

  const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    maxWidth: isMobile ? '100%' : '600px',
    margin: isMobile ? '0 8px' : '0 20px',
    backgroundColor: colors.background.secondary,
    borderRadius: '6px',
    padding: isMobile ? '4px 8px' : '7px 14px',
    boxShadow: `inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 0 5px ${colors.accent.secondary}`,
    border: `1px solid ${colors.accent.secondary}`,
    position: 'relative',
    transition: 'all 0.3s ease',
  };

  const searchInputStyle = {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: colors.text.primary,
    fontSize: isMobile ? '13px' : '15px',
    padding: isMobile ? '3px' : '6px',
    fontFamily: 'var(--font-primary)',
    fontWeight: '400',
    letterSpacing: '0.5px',
    transition: 'color 0.3s ease',
    caretColor: colors.accent.primary,
  };

  const searchIconStyle = {
    color: colors.text.secondary,
    fontSize: isMobile ? '18px' : '20px',
    transition: 'color 0.3s ease',
  };

  const searchResultsStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background.secondary,
    borderRadius: '6px',
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.8), 0 0 8px ${colors.accent.secondary}`,
    border: `1px solid ${colors.accent.secondary}`,
    marginTop: '8px',
    zIndex: 1001,
    maxHeight: '320px',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: `${colors.accent.primary} ${colors.background.tertiary}`,
  };

  const searchResultItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: isMobile ? '8px 10px' : '10px 14px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    color: colors.text.primary,
    borderBottom: `1px solid ${colors.border.primary}`,
  };

  const thumbnailStyle = {
    width: isMobile ? '60px' : '80px',
    height: isMobile ? '34px' : '45px',
    borderRadius: '4px',
    objectFit: 'cover',
    marginRight: isMobile ? '8px' : '12px',
    border: `1px solid ${colors.border.primary}`,
    transition: 'all 0.3s ease',
    boxShadow: `0 0 8px rgba(0, 0, 0, 0.6)`,
  };

  const resultTextStyle = {
    flex: 1,
  };

  const resultTitleStyle = {
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: 'var(--font-heading)',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    letterSpacing: '0.5px',
  };

  const resultChannelStyle = {
    fontSize: isMobile ? '10px' : '12px',
    color: colors.text.secondary,
    fontWeight: '400',
    fontFamily: 'var(--font-primary)',
    letterSpacing: '0.5px',
    marginTop: '2px',
  };

  const profileLinkStyle = {
    color: colors.text.primary,
    padding: isMobile ? '6px' : '9px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
  };

  // Sidebar Styles
  const sidebarStyle = isMobile
    ? {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '12px 18px',
      background: `linear-gradient(180deg, ${colors.background.secondary}, ${colors.background.primary})`,
      boxShadow: `0 -4px 12px rgba(0, 0, 0, 0.8), inset 0 0 15px ${colors.accent.secondary}`,
      position: 'fixed',
      bottom: 0,
      left: 0,
      zIndex: 1000,
      borderTop: `1px solid ${colors.accent.secondary}`,
    }
    : {
      display: 'flex',
      flexDirection: 'column',
      width: '240px',
      height: 'calc(100vh - 64px)',
      padding: '20px 24px',
      background: `linear-gradient(90deg, ${colors.background.secondary}, ${colors.background.primary})`,
      position: 'fixed',
      top: '64px',
      right: 0,
      zIndex: 1000,
      boxShadow: `-4px 0 12px rgba(0, 0, 0, 0.8), inset 0 0 15px ${colors.accent.secondary}`,
      borderLeft: `1px solid ${colors.accent.secondary}`,
    };

  const sidebarLogoStyle = isMobile
    ? { display: 'none' }
    : {
      fontSize: '22px',
      fontWeight: '700',
      color: colors.text.primary,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '24px',
      fontFamily: 'var(--font-heading)',
      textShadow: `0 0 8px ${colors.accent.primary}, 0 0 15px rgba(139, 0, 0, 0.5)`,
      letterSpacing: '1px',
      transition: 'all 0.4s ease',
    };

  const navLinksStyle = isMobile
    ? {
      display: 'flex',
      flexDirection: 'row',
      gap: '16px',
      flex: 1,
      justifyContent: 'flex-end',
    }
    : {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      flex: 1,
      marginBottom: '20px',
    };

  const linkStyle = isMobile
    ? {
      padding: '8px',
      borderRadius: '6px',
      transition: 'all 0.4s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background.tertiary,
      boxShadow: `inset 0 0 5px rgba(0, 0, 0, 0.5), 0 0 5px ${colors.accent.secondary}`,
      border: `1px solid ${colors.border.primary}`,
    }
    : {
      color: colors.text.primary,
      fontSize: '16px',
      fontWeight: '500',
      padding: '12px 16px',
      borderRadius: '6px',
      transition: 'all 0.4s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: 'var(--font-primary)',
      backgroundColor: colors.background.tertiary,
      boxShadow: `inset 0 0 5px rgba(0, 0, 0, 0.5), 0 0 5px ${colors.accent.secondary}`,
      border: `1px solid ${colors.border.primary}`,
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'hidden',
    };

  const linkDecorationStyle = !isMobile
    ? {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '5px',
      height: '100%',
      background: colors.accent.primary,
      transform: 'scaleY(0)',
      transformOrigin: 'top',
      transition: 'transform 0.4s ease',
    }
    : {};

  const activeLinkStyle = isMobile
    ? {
      ...linkStyle,
      backgroundColor: colors.background.secondary,
      boxShadow: `0 0 12px ${colors.accent.primary}, inset 0 0 8px ${colors.accent.primary}`,
      border: `1px solid ${colors.accent.primary}`,
    }
    : {
      ...linkStyle,
      color: colors.text.highlight,
      backgroundColor: colors.background.secondary,
      boxShadow: `0 0 12px ${colors.accent.primary}, inset 0 0 8px ${colors.accent.primary}`,
      border: `1px solid ${colors.accent.primary}`,
      transform: 'translateX(-5px)',
    };

  const hoverLinkStyle = isMobile
    ? {
      ...linkStyle,
      backgroundColor: colors.background.secondary,
      boxShadow: `0 0 12px ${colors.accent.primary}, inset 0 0 8px ${colors.accent.primary}`,
      border: `1px solid ${colors.accent.primary}`,
    }
    : {
      ...linkStyle,
      color: colors.text.highlight,
      backgroundColor: colors.background.secondary,
      boxShadow: `0 0 12px ${colors.accent.primary}, inset 0 0 8px ${colors.accent.primary}`,
      border: `1px solid ${colors.accent.primary}`,
      transform: 'translateX(-5px)',
    };

  const getLinkStyle = (isActive, linkName) =>
    isActive ? activeLinkStyle : hoveredLink === linkName ? hoverLinkStyle : linkStyle;

  const iconStyle = {
    color: colors.text.primary,
    fontSize: isMobile ? '20px' : '24px',
    transition: 'all 0.3s ease',
    filter: `drop-shadow(0 0 2px ${colors.accent.secondary})`,
  };

  const activeIconStyle = {
    ...iconStyle,
    color: colors.text.highlight,
    filter: `drop-shadow(0 0 4px ${colors.accent.primary})`,
  };

  const getIconStyle = (isActive) => (isActive ? activeIconStyle : iconStyle);

  const links = [
    {
      name: 'Pope Tube',
      icon: <HomeIcon style={getIconStyle(hoveredLink === 'home')} />,
      to: '/',
    },
    {
      name: 'Holy leaks',
      icon: <LocalFireDepartmentIcon style={getIconStyle(hoveredLink === 'unholy fire')} />,
      to: '/hot',
    },
    {
      name: 'Dark Past',
      icon: <HistoryIcon style={getIconStyle(hoveredLink === 'dark past')} />,
      to: '/history',
    },
  ];

  return (
    <>
      <nav ref={navbarRef} style={navbarStyle}>
        <NavLink
          to="/"
          style={logoStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.textShadow = `0 0 12px ${colors.accent.highlight}, 0 0 20px ${colors.accent.primary}`;
            e.currentTarget.style.color = colors.text.highlight;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textShadow = `0 0 8px ${colors.accent.primary}, 0 0 15px rgba(139, 0, 0, 0.5)`;
            e.currentTarget.style.color = colors.text.primary;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <VideoLibraryIcon
            style={{
              color: colors.text.primary,
              fontSize: isMobile ? '20px' : '24px',
              filter: `drop-shadow(0 0 2px ${colors.accent.primary})`,
            }}
          />
          POPE TUBE
        </NavLink>
        <div
          style={searchContainerStyle}
          id="search-container"
        >
          <input
            type="text"
            placeholder="Search the crypt for souls..."
            style={searchInputStyle}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => {
              e.target.style.color = colors.text.highlight;
              document.querySelector('#search-container').style.boxShadow = `inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 0 10px ${colors.accent.primary}`;
              document.querySelector('#search-container').style.borderColor = colors.accent.primary;
            }}
            onBlur={(e) => {
              e.target.style.color = colors.text.primary;
              document.querySelector('#search-container').style.boxShadow = `inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 0 5px ${colors.accent.secondary}`;
              document.querySelector('#search-container').style.borderColor = colors.accent.secondary;
            }}
          />
          <SearchIcon
            style={searchIconStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.accent.primary;
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.text.secondary;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
          {filteredVideos.length > 0 && (
            <div style={searchResultsStyle}>
              {filteredVideos.map((video) => (
                <NavLink
                  to={`/video/${video.id}`}
                  key={video.id}
                  style={{ textDecoration: 'none' }}
                  onClick={() => setSearchQuery('')}
                >
                  <div
                    style={searchResultItemStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.background.tertiary;
                      e.currentTarget.style.textShadow = `0 0 5px ${colors.accent.primary}`;
                      e.currentTarget.style.borderColor = colors.accent.primary;
                      e.currentTarget.querySelector('img').style.borderColor = colors.accent.primary;
                      e.currentTarget.querySelector('img').style.boxShadow = `0 0 8px ${colors.accent.secondary}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.textShadow = 'none';
                      e.currentTarget.style.borderColor = colors.border.primary;
                      e.currentTarget.querySelector('img').style.borderColor = colors.border.primary;
                      e.currentTarget.querySelector('img').style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.6)';
                    }}
                  >
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      style={thumbnailStyle}
                      onError={(e) => {
                        e.target.src = 'https://i.ytimg.com/vi/default.jpg';
                      }}
                    />
                    <div style={resultTextStyle}>
                      <div style={resultTitleStyle}>{video.snippet.title}</div>
                      <div style={resultChannelStyle}>{video.snippet.channelTitle}</div>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
        <NavLink
          to="/profile"
          style={({ isActive }) =>
            isActive
              ? {
                ...profileLinkStyle,
                boxShadow: `0 0 12px ${colors.accent.primary}`,
                backgroundColor: colors.background.secondary,
                transform: 'scale(1.1)',
              }
              : profileLinkStyle
          }
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 0 12px ${colors.accent.primary}`;
            e.currentTarget.style.backgroundColor = colors.background.secondary;
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {/* <AccountCircleIcon
            style={{
              color: colors.text.primary,
              fontSize: isMobile ? '20px' : '24px',
              filter: `drop-shadow(0 0 2px ${colors.accent.primary})`,
            }}
          /> */}
        </NavLink>
      </nav>

      <nav ref={sidebarRef} style={sidebarStyle}>
        {!isMobile && (
          <div
            style={sidebarLogoStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = `0 0 12px ${colors.accent.highlight}, 0 0 20px ${colors.accent.primary}`;
              e.currentTarget.style.color = colors.text.highlight;
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = `0 0 8px ${colors.accent.primary}, 0 0 15px rgba(139, 0, 0, 0.5)`;
              e.currentTarget.style.color = colors.text.primary;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <VideoLibraryIcon
              style={{
                color: colors.text.primary,
                fontSize: '24px',
                filter: `drop-shadow(0 0 2px ${colors.accent.primary})`,
              }}
            />
CHOOSE          </div>
        )}
        <ul style={navLinksStyle}>
          {links.map((link) => (
            <li key={link.name} style={{ position: 'relative' }}>
              {!isMobile && (
                <div
                  style={{
                    ...linkDecorationStyle,
                    transform:
                      hoveredLink === link.name.toLowerCase() || window.location.pathname === link.to
                        ? 'scaleY(1)'
                        : 'scaleY(0)',
                  }}
                />
              )}
              <NavLink
                to={link.to}
                style={({ isActive }) => getLinkStyle(isActive, link.name.toLowerCase())}
                onMouseEnter={() => setHoveredLink(link.name.toLowerCase())}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {React.cloneElement(link.icon, {
                  style: getIconStyle(
                    hoveredLink === link.name.toLowerCase() || window.location.pathname === link.to
                  ),
                })}
                {!isMobile && <span>{link.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
        <a
          href="https://x.com/popetube_sol"
          target="_blank"
          rel="noopener noreferrer"
          style={hoveredLink === 'follow-us' ? hoverLinkStyle : linkStyle}
          onMouseEnter={() => setHoveredLink('follow-us')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <XIcon style={getIconStyle(hoveredLink === 'follow-us')} />
          {!isMobile && <span>Follow Our Darkness</span>}
        </a>
      </nav>
    </>
  );
};

export default Navigation;