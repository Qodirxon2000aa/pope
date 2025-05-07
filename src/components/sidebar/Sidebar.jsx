import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HistoryIcon from '@mui/icons-material/History';
import XIcon from '@mui/icons-material/X';
import MenuIcon from '@mui/icons-material/Menu';
import VideoData from '../data/VideoData';
import "./sidebar.css"

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
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;

const Navigation = () => {
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navbarRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e) => {
      setIsMobile(e.matches);
      setIsSidebarOpen(!e.matches); // Auto-open sidebar on desktop
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    // Inject keyframes and global styles
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
      ${keyframes}
      :root {
        --sidebar-width: ${isMobile ? '0px' : isSidebarOpen ? '240px' : '0px'};
      }
      .main-content {
        margin-right: var(--sidebar-width);
        width: calc(100% - var(--sidebar-width));
        transition: margin-right 0.5s ease, width 0.5s ease, transform 0.5s ease;
        transform: ${isSidebarOpen && !isMobile ? 'scale(0.98)' : 'scale(1)'};
      }
    `;
    document.head.appendChild(styleSheet);

    // Animate navbar
    navbarRef.current.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    navbarRef.current.style.opacity = '1';
    navbarRef.current.style.transform = 'translateY(0)';

    // Animate sidebar
    sidebarRef.current.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    sidebarRef.current.style.animation = isSidebarOpen ? 'slideIn 0.5s ease forwards' : 'slideOut 0.5s ease forwards';

    const sidebarItems = sidebarRef.current.querySelectorAll('li, a');
    sidebarItems.forEach((item, index) => {
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      item.style.opacity = isSidebarOpen ? '1' : '0';
      item.style.transform = isSidebarOpen ? 'translateY(0)' : 'translateY(20px)';
      item.style.transitionDelay = `${index * 0.1}s`;
    });

    // Update main content styles
    document.documentElement.style.setProperty('--sidebar-width', isMobile ? '0px' : isSidebarOpen ? '240px' : '0px');
  }, [isMobile, isSidebarOpen]);

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
    padding: isMobile ? '8px 12px' : '12px 20px',
    background: colors.background.primary,
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    height: isMobile ? '56px' : '64px',
    borderBottom: `2px solid ${colors.border.cyan}`,
    boxShadow: `0 0 10px ${colors.accent.cyan}`,
  };

  const logoStyle = {
    fontSize: isMobile ? '22px' : '26px',
    fontWeight: '700',
    color: colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '6px' : '8px',
    fontFamily: '"Orbitron", sans-serif',
    letterSpacing: '1.5px',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
  };

  const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    maxWidth: isMobile ? '100%' : '700px',
    margin: isMobile ? '0 8px' : '0 24px',
    backgroundColor: colors.background.secondary,
    borderRadius: '30px',
    padding: isMobile ? '6px 12px' : '8px 16px',
    border: `2px solid ${colors.border.primary}`,
    transition: 'all 0.3s ease',
  };

  const searchInputStyle = {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: colors.text.primary,
    fontSize: isMobile ? '14px' : '16px',
    padding: isMobile ? '4px' : '6px',
    fontFamily: '"Poppins", sans-serif',
    fontWeight: '400',
    letterSpacing: '0.5px',
    transition: 'color 0.3s ease',
    caretColor: colors.accent.cyan,
  };

  const searchIconStyle = {
    color: colors.text.secondary,
    fontSize: isMobile ? '22px' : '24px',
    transition: 'color 0.3s ease, transform 0.3s ease',
  };

  const searchResultsStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background.secondary,
    borderRadius: '16px',
    border: `2px solid ${colors.border.cyan}`,
    marginTop: '12px',
    zIndex: 1001,
    maxHeight: '320px',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: `${colors.accent.cyan} ${colors.background.tertiary}`,
    boxShadow: `0 0 10px ${colors.accent.cyan}`,
  };

  const searchResultItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: isMobile ? '10px 12px' : '12px 16px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    color: colors.text.primary,
    borderBottom: `1px solid ${colors.border.primary}`,
  };

  const thumbnailStyle = {
    width: isMobile ? '64px' : '88px',
    height: isMobile ? '36px' : '50px',
    borderRadius: '6px',
    objectFit: 'cover',
    marginRight: isMobile ? '10px' : '14px',
    border: `1px solid ${colors.border.cyan}`,
    transition: 'all 0.3s ease',
  };

  const resultTextStyle = {
    flex: 1,
  };

  const resultTitleStyle = {
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: '"Orbitron", sans-serif',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    letterSpacing: '0.5px',
  };

  const resultChannelStyle = {
    fontSize: isMobile ? '12px' : '14px',
    color: colors.text.secondary,
    fontWeight: '400',
    fontFamily: '"Poppins", sans-serif',
    letterSpacing: '0.5px',
    marginTop: '4px',
  };

  const toggleButtonStyle = {
    display: isMobile ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    backgroundColor: colors.background.secondary,
    borderRadius: '50%',
    border: `2px solid ${colors.border.cyan}`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  // Sidebar Styles
  const sidebarStyle = isMobile
    ? {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        padding: '10px 12px',
        background: colors.background.primary,
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 1000,
        borderTop: `2px solid ${colors.border.cyan}`,
        boxShadow: `0 -2px 10px ${colors.accent.cyan}`,
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        width: '240px',
        height: 'calc(100vh - 64px)',
        padding: '20px 24px',
        background: colors.background.primary,
        position: 'fixed',
        top: '64px',
        right: 0,
        zIndex: 1000,
        borderLeft: `2px solid ${colors.border.cyan}`,
        boxShadow: `0 0 10px ${colors.accent.cyan}`,
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
        fontFamily: '"Orbitron", sans-serif',
        letterSpacing: '1.5px',
        transition: 'all 0.3s ease',
        textTransform: 'uppercase',
      };

  const navLinksStyle = isMobile
    ? {
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        flex: 1,
        justifyContent: 'space-around',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        flex: 1,
        marginBottom: '20px',
      };

  const linkStyle = isMobile
    ? {
        padding: '12px',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.tertiary,
        border: `2px solid ${colors.border.primary}`,
      }
    : {
        color: colors.text.primary,
        fontSize: '16px',
        fontWeight: '500',
        padding: '12px 16px',
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontFamily: '"Poppins", sans-serif',
        backgroundColor: colors.background.tertiary,
        border: `2px solid ${colors.border.primary}`,
        letterSpacing: '0.5px',
      };

  const activeLinkStyle = isMobile
    ? {
        ...linkStyle,
        backgroundColor: colors.accent.cyan,
        border: `2px solid ${colors.accent.cyan}`,
        animation: 'glow 1.5s infinite, pulse 1.5s infinite',
      }
    : {
        ...linkStyle,
        color: colors.text.highlight,
        backgroundColor: colors.accent.cyan,
        border: `2px solid ${colors.accent.cyan}`,
        animation: 'glow 1.5s infinite, pulse 1.5s infinite',
      };

  const hoverLinkStyle = isMobile
    ? {
        ...linkStyle,
        backgroundColor: colors.accent.cyan,
        border: `2px solid ${colors.accent.cyan}`,
        animation: 'glow 1.5s infinite, pulse 1.5s infinite',
      }
    : {
        ...linkStyle,
        color: colors.text.highlight,
        backgroundColor: colors.accent.cyan,
        border: `2px solid ${colors.accent.cyan}`,
        animation: 'glow 1.5s infinite, pulse 1.5s infinite',
      };

  const getLinkStyle = (isActive, linkName) =>
    isActive ? activeLinkStyle : hoveredLink === linkName ? hoverLinkStyle : linkStyle;

  const iconStyle = {
    color: colors.text.primary,
    fontSize: isMobile ? '26px' : '28px',
    transition: 'all 0.3s ease',
  };

  const activeIconStyle = {
    ...iconStyle,
    color: colors.text.highlight,
    filter: `drop-shadow(0 0 6px ${colors.accent.cyan})`,
  };

  const getIconStyle = (isActive) => (isActive ? activeIconStyle : iconStyle);

  const links = [
    {
      name: 'Home',
      icon: <HomeIcon style={getIconStyle(hoveredLink === 'home')} />,
      to: '/',
    },
    {
      name: 'Trending',
      icon: <LocalFireDepartmentIcon style={getIconStyle(hoveredLink === 'trending')} />,
      to: '/hot',
    },
    {
      name: 'History',
      icon: <HistoryIcon style={getIconStyle(hoveredLink === 'history')} />,
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
      e.currentTarget.style.color = colors.accent.cyan;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = colors.text.primary;
    }}
  >
    <VideoLibraryIcon
      style={{
        color: colors.text.primary,
        fontSize: isMobile ? '26px' : '30px',
      }}
    />
    Trenches
    <span style={{ color: 'yellow', textShadow: '0 0 6px gold' }}>Tube</span>
    
  </NavLink>

  <div style={searchContainerStyle} id="search-container">
    <input
      type="text"
      placeholder="Explore the grid..."
      style={searchInputStyle}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onFocus={(e) => {
        e.target.style.color = colors.text.highlight;
        document.querySelector('#search-container').style.borderColor = colors.accent.cyan;
        document.querySelector('#search-container').style.boxShadow = `0 0 12px ${colors.accent.cyan}`;
      }}
      onBlur={(e) => {
        e.target.style.color = colors.text.primary;
        document.querySelector('#search-container').style.borderColor = colors.border.primary;
        document.querySelector('#search-container').style.boxShadow = 'none';
      }}
    />
    <SearchIcon
      style={searchIconStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = colors.accent.cyan;
        e.currentTarget.style.transform = 'scale(1.15)';
        e.currentTarget.style.animation = 'pulse 1.5s infinite';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = colors.text.secondary;
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.animation = 'none';
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
                e.currentTarget.style.borderColor = colors.accent.cyan;
                e.currentTarget.style.animation = 'pulse 1.5s infinite';
                e.currentTarget.querySelector('img').style.borderColor = colors.accent.cyan;
                e.currentTarget.querySelector('img').style.boxShadow = `0 0 8px ${colors.accent.cyan}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = colors.border.primary;
                e.currentTarget.style.animation = 'none';
                e.currentTarget.querySelector('img').style.borderColor = colors.border.primary;
                e.currentTarget.querySelector('img').style.boxShadow = 'none';
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

  {!isMobile && (
    <div
      style={toggleButtonStyle}
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.accent.cyan;
        e.currentTarget.style.animation = 'glowPulse 2s infinite';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.background.secondary;
        e.currentTarget.style.animation = 'none';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <MenuIcon
        style={{
          color: colors.text.primary,
          fontSize: '26px',
          transition: 'all 0.3s ease',
        }}
      />
    </div>
  )}
</nav>


      <nav ref={sidebarRef} style={sidebarStyle}>
        {!isMobile && (
          <div
            style={sidebarLogoStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.accent.cyan;
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.animation = 'pulse 1.5s infinite';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.text.primary;
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.animation = 'none';
            }}
          >
            <VideoLibraryIcon
              style={{
                color: colors.text.primary,
                fontSize: '26px',
                transition: 'all 0.3s ease',
              }}
            />
            CHOOSE
          </div>
        )}
        <ul style={navLinksStyle}>
          {links.map((link) => (
            <li key={link.name}>
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
          href="https://x.com/trenchestubed"
          target="_blank"
          rel="noopener noreferrer"
          style={hoveredLink === 'follow-us' ? hoverLinkStyle : linkStyle}
          onMouseEnter={() => setHoveredLink('follow-us')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <XIcon style={getIconStyle(hoveredLink === 'follow-us')} />
          {!isMobile && <span>Connect</span>}
        </a>
      </nav>
    </>
  );
};

export default Navigation;