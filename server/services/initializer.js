import { DEFAULT_PLAYLIST_SEED_DATA } from "../utils/constant.js";
import DefaultPlaylistManager from "../utils/queue/defaultPlaylistManager.js";
import Service from "./apiService.js"
import logger from "../utils/logger.js";

class Initializer {
    static async init() {
        await this.defaultPlaylistInitializer();
    }

    static async defaultPlaylistInitializer() {
        const defaultPlaylist = new DefaultPlaylistManager();
        if (defaultPlaylist.getLength() !== 0) {
            logger.info("Default playlist already initialized");
            return;
        }
        
        logger.info("Initializing default playlist");
        const seedData = DEFAULT_PLAYLIST_SEED_DATA();
        logger.info("Seed data:", seedData);
        
        const apiService = new Service();
        for (const playlist of seedData) {
            try {
                logger.info("Adding playlist:", playlist);
                await apiService.addDefaultPlaylist(playlist);
                logger.info("Successfully added playlist:", playlist);
            } catch (error) {
                logger.error("Error adding playlist:", { 
                    playlist, 
                    error: error.message,
                    stack: error.stack
                });
            }
        }
    }
}

export default Initializer;