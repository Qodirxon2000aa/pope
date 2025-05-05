import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import VideoData from '../data/VideoData'
import ContentLoader from 'react-content-loader'

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
}

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
		background: radial-gradient(
			circle,
			${colors.accent.gold} 0%,
			transparent 70%
		);
		opacity: 0.7;
		clip-path: polygon(
			50% 0%,
			60% 40%,
			100% 50%,
			60% 60%,
			50% 100%,
			40% 60%,
			0% 50%,
			40% 40%
		);
		transition: opacity 0.3s ease, transform 0.3s ease;
	}

	.fleur-de-lis-top-right {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 20px;
		height: 20px;
		background: radial-gradient(
			circle,
			${colors.accent.gold} 0%,
			transparent 70%
		);
		opacity: 0.7;
		clip-path: polygon(
			50% 0%,
			60% 40%,
			100% 50%,
			60% 60%,
			50% 100%,
			40% 60%,
			0% 50%,
			40% 40%
		);
		transition: opacity 0.3s ease, transform 0.3s ease;
	}

	.bottom-border {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 12px;
		background: linear-gradient(
			90deg,
			transparent,
			${colors.accent.gold},
			transparent
		);
		mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='12'><path d='M0,6 Q75,12 150,6 T300,6' fill='none' stroke='black'/></svg>");
		opacity: 0.3;
		transition: opacity 0.3s ease;
	}
`

// Styled Components
const VideoGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: ${({ isMobile }) => (isMobile ? '16px' : '24px')};
	padding: ${({ isMobile }) => (isMobile ? '14px' : '20px')};
	background: ${colors.background.primary};
	min-height: 100vh;
	box-shadow: inset 0 0 15px ${colors.accent.secondary};
`

const VideoCard = styled.div`
	position: relative;
	background-color: ${colors.background.tertiary};
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(139, 0, 0, 0.3);
	border: 1px solid ${colors.border.highlight};
	transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	height: 100%;
	display: flex;
	flex-direction: column;
	background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%235e0000' fill-opacity='0.1'/%3E%3C/svg%3E");

	&:hover {
		transform: translateY(-8px) scale(1.03);
		box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8), 0 10px 20px rgba(139, 0, 0, 0.6),
			0 5px 15px rgba(212, 175, 55, 0.3), inset 0 0 30px rgba(192, 0, 0, 0.4);
		border-color: ${colors.accent.highlight};

		.thumbnail-img {
			transform: scale(1.05);
		}

		.play-button {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1.1);
		}

		.title-text {
			color: ${colors.text.highlight};
			text-shadow: 1px 1px 2px ${colors.background.primary},
				-1px -1px 2px ${colors.background.primary},
				0 0 12px ${colors.accent.gold};
		}

		.channel-name {
			color: ${colors.text.gold};
		}

		.metadata {
			color: ${colors.text.primary};
		}

		.gothic-decoration {
			opacity: 0.9;
		}

		.fleur-de-lis-top-left,
		.fleur-de-lis-top-right {
			opacity: 1;
			transform: scale(1.1);
		}

		.bottom-border {
			opacity: 0.6;
		}
	}
`

const ThumbnailContainer = styled.div`
	position: relative;
	width: 100%;
	aspect-ratio: 16/9;
	overflow: hidden;
	border-bottom: 2px solid ${colors.border.highlight};
	box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
`

const ThumbnailFrame = styled.div`
	position: absolute;
	top: 8px;
	left: 8px;
	right: 8px;
	bottom: 8px;
	border: 1px solid ${colors.border.gold};
	border-radius: 4px;
	overflow: hidden;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
	background: #000;
`

const Thumbnail = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.3s ease;
`

const PlayButton = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 50px;
	height: 50px;
	background: radial-gradient(
		circle,
		${colors.accent.gold} 0%,
		${colors.accent.secondary} 100%
	);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.8;
	transition: all 0.3s ease;
	box-shadow: 0 0 15px ${colors.accent.gold};

	&:focus {
		outline: none;
		box-shadow: 0 0 20px ${colors.accent.highlight};
	}

	&:after {
		content: '';
		width: 0;
		height: 0;
		border-top: 12px solid transparent;
		border-left: 20px solid ${colors.background.primary};
		border-bottom: 12px solid transparent;
		margin-left: 5px;
	}
`

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
	transition: all 0.3s ease;

	${VideoCard}:hover & {
		background: linear-gradient(
			135deg,
			rgba(139, 0, 0, 0.2) 0%,
			rgba(94, 0, 0, 0.3) 50%,
			rgba(139, 0, 0, 0.2) 100%
		);
	}
`

const DurationBadge = styled.div`
	position: absolute;
	bottom: 12px;
	right: 12px;
	background-color: ${colors.background.primary};
	color: ${colors.text.gold};
	padding: 3px 8px;
	border-radius: 4px;
	font-size: ${({ isMobile }) => (isMobile ? '10px' : '12px')};
	font-weight: 600;
	font-family: 'UnifrakturCook', 'Old English Text MT', 'Times New Roman', serif;
	border: 1px solid ${colors.border.gold};
	box-shadow: 0 0 8px ${colors.accent.gold};
	transition: all 0.3s ease;

	${VideoCard}:hover & {
		background-color: ${colors.accent.primary};
		color: ${colors.text.highlight};
	}
`

const VideoInfo = styled.div`
	padding: ${({ isMobile }) => (isMobile ? '12px' : '16px')};
	flex: 1;
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 2;
`

const Title = styled.h3`
	font-size: ${({ isMobile }) => (isMobile ? '16px' : '18px')};
	font-weight: 700;
	color: ${colors.text.gold};
	margin-bottom: 8px;
	font-family: 'UnifrakturCook', 'Old English Text MT', 'Times New Roman', serif;
	text-shadow: 1px 1px 2px ${colors.background.primary},
		-1px -1px 2px ${colors.background.primary}, 0 0 8px ${colors.accent.gold};
	line-height: 1.3;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	flex: 1;
	transition: all 0.3s ease;
`

const Divider = styled.div`
	display: flex;
	align-items: center;
	margin: 8px 0;
	position: relative;

	.line-left {
		flex: 1;
		height: 1px;
		background: linear-gradient(
			to right,
			${colors.border.highlight},
			transparent
		);
		transition: all 0.3s ease;
	}

	.line-right {
		flex: 1;
		height: 1px;
		background: linear-gradient(
			to left,
			${colors.border.highlight},
			transparent
		);
		transition: all 0.3s ease;
	}

	.fleur-de-lis {
		width: 20px;
		height: 20px;
		margin: 0 8px;
		background: radial-gradient(
			circle,
			${colors.accent.gold} 0%,
			transparent 70%
		);
		clip-path: polygon(
			50% 0%,
			60% 40%,
			100% 50%,
			60% 60%,
			50% 100%,
			40% 60%,
			0% 50%,
			40% 40%
		);
		opacity: 0.7;
		transition: all 0.3s ease;
	}

	${VideoCard}:hover & {
		.line-left,
		.line-right {
			background: linear-gradient(to right, ${colors.accent.gold}, transparent);
		}
		.fleur-de-lis {
			opacity: 1;
			transform: scale(1.2);
		}
	}
`

const ChannelMetaContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const Channel = styled.div`
	font-size: ${({ isMobile }) => (isMobile ? '12px' : '14px')};
	color: ${colors.text.secondary};
	font-family: 'UnifrakturCook', 'Old English Text MT', 'Times New Roman', serif;
	text-shadow: 0 0 2px ${colors.background.primary};
	transition: all 0.3s ease;
`

const Meta = styled.div`
	display: flex;
	gap: 8px;
	font-size: ${({ isMobile }) => (isMobile ? '10px' : '12px')};
	color: ${colors.text.secondary};
	font-family: 'UnifrakturCook', 'Old English Text MT', 'Times New Roman', serif;
	transition: all 0.3s ease;

	svg {
		width: 12px;
		height: 12px;
		stroke: ${colors.text.secondary};
		stroke-width: 2;
		transition: all 0.3s ease;
	}

	${VideoCard}:hover & {
		svg {
			stroke: ${colors.text.primary};
		}
	}
`

// Skeleton Loader Component
const VideoCardSkeleton = ({ isMobile }) => (
	<ContentLoader
		speed={2}
		width={280}
		height={isMobile ? 340 : 360}
		viewBox='0 0 280 360'
		backgroundColor={colors.background.tertiary}
		foregroundColor={colors.border.primary}
	>
		{/* Thumbnail Frame */}
		<rect x='8' y='8' rx='4' ry='4' width='264' height='149' />
		{/* Duration Badge */}
		<rect x='230' y='135' rx='4' ry='4' width='40' height='14' />
		{/* Title */}
		<rect x='12' y='165' rx='4' ry='4' width='200' height='18' />
		<rect x='12' y='187' rx='4' ry='4' width='150' height='18' />
		{/* Divider */}
		<rect x='12' y='215' rx='2' ry='2' width='256' height='1' />
		<rect x='130' y='205' rx='4' ry='4' width='20' height='20' />
		{/* Channel */}
		<rect x='12' y='230' rx='4' ry='4' width='120' height='14' />
		{/* Meta */}
		<rect x='160' y='230' rx='4' ry='4' width='80' height='12' />
	</ContentLoader>
)

// Utility Functions
const formatDuration = duration => {
	const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
	const hours = match[1] ? parseInt(match[1]) : 0
	const minutes = match[2] ? parseInt(match[2]) : 0
	const seconds = match[3] ? parseInt(match[3]) : 0
	if (hours) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`
	}
	return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formatViews = count => {
	if (count.includes('K')) return count
	const num = parseInt(count.replace(/[^0-9]/g, ''))
	return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num
}

const formatDate = dateString => {
	const date = new Date(dateString)
	const day = date.getDate()
	const month = date.toLocaleString('default', { month: 'short' })
	const year = date.getFullYear()
	return `${day} ${month} ${year}`
}

const isValidYouTubeId = id => {
	return typeof id === 'string' && /^[A-Za-z0-9_-]{11}$/.test(id)
}

// Custom Hook for Media Queries
const useMediaQuery = query => {
	const [matches, setMatches] = useState(window.matchMedia(query).matches)

	useEffect(() => {
		const media = window.matchMedia(query)
		const listener = () => setMatches(media.matches)
		media.addListener(listener)
		return () => media.removeListener(listener)
	}, [query])

	return matches
}

// Mock Enhanced Video Data
const enhanceVideoData = videos => {
	return videos
		.filter(video => isValidYouTubeId(video.id))
		.map(video => ({
			...video,
			contentDetails: {
				duration:
					video.contentDetails?.duration ||
					`PT${Math.floor(Math.random() * 10 + 1)}M${Math.floor(
						Math.random() * 60
					)}S`,
			},
		}))
}

const Home = () => {
	const isMobile = useMediaQuery('(max-width: 768px)')
	const [videos, setVideos] = useState([])
	const [page, setPage] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const loaderRef = useRef(null)

	const fetchVideos = pageNum => {
		if (!hasMore || isLoading) return

		setIsLoading(true)

		if (!Array.isArray(VideoData)) {
			console.error('VideoData is not an array:', VideoData)
			setIsLoading(false)
			setHasMore(false)
			return
		}

		setTimeout(() => {
			const start = (pageNum - 1) * 12
			const end = start + 12
			const paginatedVideos = enhanceVideoData(VideoData.slice(start, end))

			if (paginatedVideos.length > 0) {
				setVideos(prev => [...prev, ...paginatedVideos])
			}
			if (paginatedVideos.length < 12 || end >= VideoData.length) {
				setHasMore(false)
			}
			setIsLoading(false)
		}, 500)
	}

	useEffect(() => {
		fetchVideos(page)
	}, [page])

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && !isLoading && hasMore) {
					setPage(prev => prev + 1)
				}
			},
			{ threshold: 0.1 }
		)

		if (loaderRef.current) {
			observer.observe(loaderRef.current)
		}

		return () => {
			if (loaderRef.current) {
				observer.unobserve(loaderRef.current)
			}
		}
	}, [isLoading, hasMore])

	if (videos.length === 0 && !isLoading) {
		return (
			<VideoGrid isMobile={isMobile}>
				<div
					style={{
						color: colors.text.gold,
						fontFamily:
							'"UnifrakturCook", "Old English Text MT", "Times New Roman", serif',
						fontSize: isMobile ? '16px' : '20px',
						textAlign: 'center',
						padding: '20px',
					}}
				>
					No valid videos available
				</div>
			</VideoGrid>
		)
	}

	return (
		<VideoGrid isMobile={isMobile}>
			{videos.map(video => (
				<Link
					to={`/video/${video.id}`}
					key={video.id}
					style={{ textDecoration: 'none' }}
					aria-label={`Watch ${video.snippet.title} by ${video.snippet.channelTitle}`}
				>
					<VideoCard>
						<GothicDecorations className='gothic-decoration'>
							<div className='fleur-de-lis-top-left' />
							<div className='fleur-de-lis-top-right' />
							<div className='bottom-border' />
						</GothicDecorations>
						<StainedGlassOverlay />
						<ThumbnailContainer>
							<ThumbnailFrame>
								<Thumbnail
									className='thumbnail-img'
									src={video.snippet.thumbnails.medium.url}
									alt={video.snippet.title}
									onError={e => {
										e.target.src = 'https://i.ytimg.com/vi/default.jpg'
									}}
								/>
							</ThumbnailFrame>
							<PlayButton className='play-button' tabIndex={0} />
							<DurationBadge isMobile={isMobile}>
								{formatDuration(video.contentDetails.duration)}
							</DurationBadge>
						</ThumbnailContainer>
						<VideoInfo isMobile={isMobile}>
							<Title className='title-text' isMobile={isMobile}>
								{video.snippet.title}
							</Title>
							<Divider>
								<div className='line-left' />
								<div className='fleur-de-lis' />
								<div className='line-right' />
							</Divider>
							<ChannelMetaContainer>
								<Channel className='channel-name' isMobile={isMobile}>
									{video.snippet.channelTitle}
								</Channel>
								<Meta className='metadata' isMobile={isMobile}>
									<span>
										<svg viewBox='0 0 24 24' fill='none'>
											<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
											<circle cx='12' cy='12' r='3' />
										</svg>
										{formatViews(video.statistics.viewCount)}
									</span>
									<span>
										<svg viewBox='0 0 24 24' fill='none'>
											<rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
											<line x1='16' y1='2' x2='16' y2='6' />
											<line x1='8' y1='2' x2='8' y2='6' />
											<line x1='3' y1='10' x2='21' y2='10' />
										</svg>
										{formatDate(video.snippet.publishedAt)}
									</span>
								</Meta>
							</ChannelMetaContainer>
						</VideoInfo>
					</VideoCard>
				</Link>
			))}
			{isLoading &&
				hasMore &&
				Array(4)
					.fill()
					.map((_, index) => (
						<VideoCardSkeleton key={`skeleton-${index}`} isMobile={isMobile} />
					))}
			<div ref={loaderRef} style={{ height: '20px' }} />
		</VideoGrid>
	)
}

export default Home
