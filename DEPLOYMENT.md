# Deployment Guide

This guide will help you deploy MRadio to a production environment.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A server with public IP address (for external access)
- Domain name (optional but recommended)

## Production Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MRadio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file and update the following variables for production:

```env
NODE_ENV=production
FFMPEG_ENV=production
PORT=9126

# Set strong admin keys
X_ADMIN_API_KEY=your_strong_admin_api_key
X_ADMIN_TOKEN_KEY=your_strong_admin_token_key

# Configure music platform APIs (optional)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET_ID=your_spotify_client_secret
SOUNDCLOUD_API_KEY=your_soundcloud_api_key

# Icecast configuration (if using)
ICECAST_HOST=your_icecast_server
ICECAST_PORT=8000
ICECAST_PASSWORD=your_icecast_source_password
```

### 4. Set Up Reverse Proxy (Recommended)

For production use, it's recommended to set up a reverse proxy with NGINX or Apache.

#### NGINX Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:9126;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Set Up SSL (Recommended)

Use Let's Encrypt to set up SSL certificates:

```bash
sudo certbot --nginx -d your-domain.com
```

### 6. Process Management

Use PM2 to manage the Node.js process:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server/index.js --name "mradio"

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### 7. Firewall Configuration

Open necessary ports:

```bash
# For HTTP streaming
sudo ufw allow 9126

# For HTTPS (if using reverse proxy)
sudo ufw allow 443

# For Icecast (if using)
sudo ufw allow 8000
```

## Using Docker (Alternative Deployment)

If you prefer to use Docker:

1. Build the Docker image:
   ```bash
   docker build -t mradio .
   ```

2. Run the container:
   ```bash
   docker run -d \
     --name mradio \
     -p 9126:9126 \
     -v ./media:/app/media \
     -v ./data:/app/data \
     -v ./config:/app/config \
     -v ./cache:/app/cache \
     --env-file .env \
     mradio
   ```

## Monitoring and Maintenance

### Logs

Monitor application logs:

```bash
# If using PM2
pm2 logs mradio

# Or check log files
tail -f logs/*.log
```

### Updates

To update the application:

```bash
# Pull latest changes
git pull origin main

# Install/update dependencies
npm install

# Restart the application
pm2 restart mradio
```

### Backup

Regularly backup important data:

```bash
# Backup configuration and data
tar -czf mradio-backup-$(date +%Y%m%d).tar.gz .env data/ config/
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in .env or stop the process using the port
2. **Permission denied**: Ensure the user has proper permissions for directories
3. **FFmpeg errors**: Verify ffmpeg-static is properly installed
4. **API key issues**: Check that all required API keys are properly configured

### Debugging

Enable debug logging by setting in .env:
```env
DEBUG=*
```

Check system resources:
```bash
# Check memory usage
free -h

# Check disk space
df -h

# Check running processes
ps aux | grep node
```