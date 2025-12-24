# JWT Authentication Implementation - Frontend

## Changes Made

### 1. **JWT Interceptor** 
- **File**: `src/app/shared/interceptors/jwt.interceptor.ts` (NEW)
- **Purpose**: Automatically adds JWT token to all HTTP requests
- **Features**:
  - Extracts token from localStorage
  - Adds `Authorization: Bearer {token}` header to all requests
  - Handles 401 (Unauthorized) responses by logging out the user

### 2. **Enhanced Auth Service**
- **File**: `src/app/shared/services/auth.service.ts` (UPDATED)
- **New Methods**:
  - `getToken()`: Retrieves the stored JWT token
  - `setToken(token)`: Securely stores the JWT token
  - `isTokenValid()`: Validates token existence and expiration
- **Improvements**:
  - Added `TOKEN_KEY` constant for consistent token storage
  - Enhanced token validation with expiration check
  - Better error handling for token decoding
  - Changed `logout()` to only clear the auth token (not all localStorage)

### 3. **App Module Configuration**
- **File**: `src/app/app.module.ts` (UPDATED)
- **Changes**:
  - Imported `HTTP_INTERCEPTORS` from `@angular/common/http`
  - Imported `JwtInterceptor`
  - Registered `JwtInterceptor` in providers for automatic HTTP request handling

### 4. **Existing Auth Guard**
- **File**: `src/app/shared/guards/auth.guard.ts` (Already Configured)
- **Purpose**: Protects routes by checking user authentication status
- **Features**: Redirects unauthenticated users to login page

## How It Works

1. **Login Flow**:
   - User logs in via the login component
   - Backend returns JWT token in response
   - Token is stored in localStorage
   - Token is decoded to extract user data
   - User data is stored in `currentUser$` BehaviorSubject

2. **Request Interception**:
   - Every HTTP request automatically includes the JWT token
   - Token is sent as `Authorization: Bearer {token}` header
   - No manual token handling needed in components

3. **Error Handling**:
   - If server returns 401 (Unauthorized), user is automatically logged out
   - User is redirected to login page

4. **Token Validation**:
   - Token validity can be checked using `authService.isTokenValid()`
   - Includes expiration time validation

## Usage Examples

### Check if user is authenticated:
```typescript
this.authService.currentUser$.subscribe((user) => {
  if (user) {
    // User is authenticated
  }
});
```

### Get current JWT token:
```typescript
const token = this.authService.getToken();
```

### Check token validity:
```typescript
if (this.authService.isTokenValid()) {
  // Token is valid and not expired
}
```

### Manual logout:
```typescript
this.authService.logout();
```

## Security Notes

- JWT token is stored in localStorage (accessible to JavaScript)
- For sensitive applications, consider using httpOnly cookies instead
- Token expiration is validated on frontend (backend validation is also important)
- All HTTP requests automatically include the token
- 401 responses trigger automatic logout
