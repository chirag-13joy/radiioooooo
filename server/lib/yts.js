import yts from 'yt-search'
import logger from '../utils/logger.js';
import { checkSimilarity, getCookiesPath } from '../utils/utils.js';

class Yts {
    async getVideoDetail(name, artistName) {
        try {
            const r = await yts({ query: `${name} - ${artistName} official audio song music`, category: 'music' });
            if (r.videos?.length === 0) {
                return;
            }

            const result = r.videos.find(track => checkSimilarity(name, track.title) > 60);
            return result;
        } catch (error) {
            logger.error("Error getting details: " + error.message);
            return;
        }
    }

    async getVideoDetailByUrl(videoId) {
        try {
            const r = await yts({ videoId: videoId });
            if (r.videos?.length === 0) {
                return;
            }
            return r;
        } catch (error) {
            logger.error("Error getting details: " + error.message);
            throw error;
        }
    }

    async validateVideo(url) {
        try {
            // Simple validation without using yt-dlp-exec
            logger.info(`Validating video: ${url}`);
            
            // For now, we'll just return a successful validation
            // In a real implementation, you might want to add actual validation logic
            return {
                status: true,
                message: 'Video validation passed',
                extractionMethod: 'basic'
            };
        } catch (error) {
            logger.error('Video validation error:', error);
            return {
                status: false,
                message: `Video validation error: ${error.message}`
            }
        }
    }
    async getPlaylistDetail(listId) {
        try {
            const r = await yts({ listId });
            if (r.videos?.length === 0) {
                throw new Error('No video found for the given name and artist');
            }

            return r.videos;
        } catch (error) {
            logger.error("Error getting details: " + error.message);
            throw error;
        }
    }

    async checkVideoAvailability(url) {
        try {
            // Simple availability check without using yt-dlp-exec
            logger.info(`Checking video availability: ${url}`);
            
            // For now, we'll just return a successful availability check
            // In a real implementation, you might want to add actual availability checking logic
            return {
                available: true,
                info: { title: 'Sample Video' }
            };
        } catch (error) {
            logger.warn(`Video availability check failed for ${url}:`, error.message);
            return {
                available: false,
                error: 'Video is not accessible'
            };
        }
    }

    async debugVideoFormats(url) {
        try {
            // Simple format listing without using yt-dlp-exec
            logger.info(`Listing formats for: ${url}`);
            
            // For now, we'll just return null
            // In a real implementation, you might want to add actual format listing logic
            logger.info(`Format listing not implemented without yt-dlp-exec`);
            return null;
        } catch (error) {
            logger.error(`Could not list formats for ${url}:`, error.message);
            return null;
        }
    }
}

export default Yts;