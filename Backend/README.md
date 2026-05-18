# NestHub API (Spring Boot)

Spring Boot backend for NestHub: property listings, JWT auth, OAuth2 (Google/GitHub), search, MongoDB, Cloudinary.

## Requirements

- Java 17+
- Maven (wrapper included)
- MongoDB Atlas (or local MongoDB)
- Cloudinary account (for listing images)
- Optional: Google/GitHub OAuth app credentials

## Setup

1. Copy environment variables:

```powershell
copy .env.example .env
```

2. Set `ATLASDB`, `JWT_SECRET`, Cloudinary vars, and optionally OAuth credentials.

3. Run (port **4000**):

```powershell
.\mvnw.cmd spring-boot:run
```

Load env vars on Windows before run:

```powershell
Get-Content .env | ForEach-Object { if ($_ -match '^\s*([^#][^=]+)=(.*)$') { Set-Item -Path "env:$($matches[1].Trim())" -Value $matches[2].Trim() } }
.\mvnw.cmd spring-boot:run
```

## API routes

| Method | Path | Auth |
|--------|------|------|
| GET | `/listings` | No — all listings |
| GET | `/listings/search` | No — `q`, `location`, `country`, `minPrice`, `maxPrice`, `sortBy`, `sortDir`, `page`, `size` |
| GET | `/listings/suggestions` | No — `q`, `limit` |
| GET | `/listings/{id}` | No |
| POST | `/listings` | JWT + multipart |
| PUT | `/listings/{id}` | JWT + owner |
| DELETE | `/listings/{id}` | JWT + owner |
| POST | `/listings/{id}/reviews` | JWT |
| DELETE | `/listings/{id}/reviews/{reviewId}` | JWT + author |
| POST | `/signup` | No |
| POST | `/login` | No |
| GET | `/logout` | No |
| GET | `/auth/me` | JWT |
| GET | `/auth/oauth/providers` | No |
| GET | `/oauth2/authorization/{provider}` | No — browser redirect (google, github) |

## OAuth2 setup

1. **Google:** Console → OAuth client → redirect URI: `http://localhost:4000/login/oauth2/code/google`
2. **GitHub:** Settings → OAuth App → callback: `http://localhost:4000/login/oauth2/code/github`
3. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` in `.env`
4. Set `FRONTEND_URL=http://localhost:5173` for post-login redirect

## Search examples

```
GET /listings/search?q=beach&page=0&size=12&sortBy=price&sortDir=asc
GET /listings/suggestions?q=par
```

## Project layout

- `config/` — Security, CORS, OAuth2 client
- `controller/` — REST endpoints
- `service/` — Business logic, search, JWT, Cloudinary
- `repository/` — Spring Data MongoDB
- `entity/` — MongoDB documents
- `dto/` — Request/response shapes
- `security/` — JWT filter, OAuth2 handlers
- `exception/` — Global error handling
