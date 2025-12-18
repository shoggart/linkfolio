# Docker Deployment Guide for LinkFolio

This guide explains how to run LinkFolio using Docker for both development and production environments.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git (to clone the repository)

## Quick Start

### Development Environment

For local development with hot reloading:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd linkfolio

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your actual values

# 3. Create data directory for SQLite
mkdir -p data

# 4. Start the development environment
docker-compose -f docker-compose.dev.yml up

# The app will be available at http://localhost:3000
# Adminer (database UI) will be available at http://localhost:8080
```

### Production Environment

For production deployment:

```bash
# 1. Build the production image
docker-compose build

# 2. Start the production environment
docker-compose up -d

# 3. Check logs
docker-compose logs -f app

# The app will be available at http://localhost:3000
```

## Docker Files Overview

### Main Docker Files

1. **Dockerfile** - Production-optimized multi-stage build
   - Uses Node.js 20 Alpine for minimal image size
   - Multi-stage build for security and performance
   - Includes health checks
   - Runs as non-root user

2. **Dockerfile.dev** - Development-optimized build
   - Supports hot reloading
   - Includes all dev dependencies
   - Faster iteration cycles

3. **docker-compose.yml** - Production configuration
   - App service with health checks
   - Volume mounts for data persistence
   - Optional PostgreSQL service
   - Network isolation

4. **docker-compose.dev.yml** - Development configuration
   - Source code mounted for hot reload
   - Includes Adminer for database management
   - Development environment variables

5. **.dockerignore** - Excludes unnecessary files from build context
   - Reduces build time
   - Improves security

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="file:/app/data/dev.db"

# Auth Secret - Generate with: openssl rand -base64 32
AUTH_SECRET="your-secret-key-here"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRO_MONTHLY_PRICE_ID="price_..."
STRIPE_PRO_YEARLY_PRICE_ID="price_..."
```

## Database Setup

### Using SQLite (Default)

SQLite is the default database and works great for small to medium deployments:

```bash
# Create data directory
mkdir -p data

# The database will be automatically created when the app starts
# It will be persisted in the ./data directory
```

### Using PostgreSQL (Optional)

For production deployments or larger scale, PostgreSQL is recommended:

1. **Uncomment PostgreSQL service** in `docker-compose.yml`:

```yaml
postgres:
  image: postgres:16-alpine
  container_name: linkfolio-postgres
  environment:
    - POSTGRES_USER=linkfolio
    - POSTGRES_PASSWORD=linkfolio_password
    - POSTGRES_DB=linkfolio
  ports:
    - "5432:5432"
  volumes:
    - postgres-data:/var/lib/postgresql/data
  restart: unless-stopped
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U linkfolio"]
    interval: 10s
    timeout: 5s
    retries: 5
  networks:
    - linkfolio-network
```

2. **Update DATABASE_URL** in your `.env`:

```bash
DATABASE_URL="postgresql://linkfolio:linkfolio_password@postgres:5432/linkfolio"
```

3. **Update Prisma schema** (`prisma/schema.prisma`):

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

4. **Run migrations**:

```bash
docker-compose exec app npx prisma migrate deploy
```

## Common Docker Commands

### Building and Running

```bash
# Build the production image
docker-compose build

# Start services in detached mode
docker-compose up -d

# Start services with logs
docker-compose up

# Stop services
docker-compose down

# Stop services and remove volumes
docker-compose down -v
```

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Rebuild development image
docker-compose -f docker-compose.dev.yml build

# View logs
docker-compose -f docker-compose.dev.yml logs -f app
```

### Database Commands

```bash
# Run Prisma migrations
docker-compose exec app npx prisma migrate deploy

# Generate Prisma client
docker-compose exec app npx prisma generate

# Open Prisma Studio
docker-compose exec app npx prisma studio

# Run database seed
docker-compose exec app npm run db:seed

# Push schema changes (development)
docker-compose exec app npx prisma db push
```

### Maintenance Commands

```bash
# View logs
docker-compose logs -f app

# Execute shell in running container
docker-compose exec app sh

# Check health status
docker-compose ps

# View resource usage
docker stats linkfolio-app

# Restart app
docker-compose restart app
```

## Health Checks

The application includes a health check endpoint at `/api/health` that:
- Verifies database connectivity
- Returns health status and timestamp
- Used by Docker to monitor container health

```bash
# Check health status
curl http://localhost:3000/api/health

# Response (healthy):
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

## Volumes and Data Persistence

### SQLite

```bash
# Data is persisted in ./data directory
./data/
  └── dev.db

# Backup database
cp data/dev.db data/dev.db.backup

# Restore database
cp data/dev.db.backup data/dev.db
```

### PostgreSQL

```bash
# Data is stored in Docker volume
docker volume ls | grep postgres

# Backup database
docker-compose exec postgres pg_dump -U linkfolio linkfolio > backup.sql

# Restore database
docker-compose exec -T postgres psql -U linkfolio linkfolio < backup.sql
```

## Production Deployment

### Using Docker Compose

1. **Set production environment variables**:

```bash
# Create .env.production
AUTH_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
DATABASE_URL="postgresql://user:pass@host:5432/db"
# ... other production values
```

2. **Deploy**:

```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Check status
docker-compose ps
```

### Using Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml linkfolio

# Check services
docker stack services linkfolio

# Remove stack
docker stack rm linkfolio
```

### Using Kubernetes

For Kubernetes deployment, you'll need to create:
- Deployment manifests
- Service manifests
- ConfigMaps for environment variables
- Secrets for sensitive data
- PersistentVolumeClaims for data

Example deployment coming soon...

## Monitoring and Logging

### View Logs

```bash
# All logs
docker-compose logs -f

# App logs only
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app

# Follow logs with timestamps
docker-compose logs -f --timestamps app
```

### Resource Monitoring

```bash
# Real-time stats
docker stats linkfolio-app

# Inspect container
docker inspect linkfolio-app

# Check health
docker inspect --format='{{json .State.Health}}' linkfolio-app
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs app

# Check container status
docker-compose ps

# Rebuild image
docker-compose build --no-cache app
```

### Database connection issues

```bash
# Check if database exists
docker-compose exec app ls -la data/

# Verify Prisma client is generated
docker-compose exec app npx prisma generate

# Reset database (CAUTION: destroys data)
docker-compose down -v
docker-compose up -d
```

### Port conflicts

```bash
# If port 3000 is already in use, change it in docker-compose.yml:
ports:
  - "3001:3000"  # Host:Container
```

### Out of disk space

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

## Security Best Practices

1. **Use secrets management**:
   - Use Docker secrets or external secret managers
   - Never commit `.env` files to version control

2. **Run as non-root user**:
   - The Dockerfile already implements this
   - User `nextjs` (UID 1001)

3. **Keep images updated**:
   ```bash
   # Update base images
   docker-compose pull
   docker-compose build --no-cache
   ```

4. **Scan for vulnerabilities**:
   ```bash
   # Using Docker Scout
   docker scout cves linkfolio-app

   # Using Trivy
   trivy image linkfolio-app
   ```

5. **Use read-only file systems where possible**:
   ```yaml
   services:
     app:
       read_only: true
       tmpfs:
         - /tmp
         - /app/.next
   ```

## Performance Optimization

### Build Performance

```bash
# Use BuildKit
DOCKER_BUILDKIT=1 docker-compose build

# Use layer caching
docker-compose build --parallel
```

### Runtime Performance

```bash
# Limit resources
docker-compose up -d --scale app=1 \
  --memory="512m" \
  --cpus="1.0"
```

### Image Size

The production image is optimized:
- Multi-stage build
- Alpine base image (~50MB)
- Only production dependencies
- Standalone Next.js output

```bash
# Check image size
docker images linkfolio-app
```

## CI/CD Integration

### GitHub Actions

The repository includes `.github/workflows/ci.yml` for automated:
- Linting
- Building
- Testing (when tests are added)

### Docker Hub

To push to Docker Hub:

```bash
# Tag image
docker tag linkfolio-app your-username/linkfolio:latest

# Push image
docker push your-username/linkfolio:latest
```

## Support and Resources

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-aws-ecs)

## License

See the main README.md file for license information.
