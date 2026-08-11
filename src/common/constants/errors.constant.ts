export const ERRORS = {
  USER: {
    EMAIL_ALREADY_EXISTS: 'User with this email already exists',
    INVALID_CREDENTIALS: 'Email or password is incorrect',
    REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
    USER_NOT_FOUND: 'User not found',
    INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
  },
  AUTH: {
    TOKEN_MISSING: 'Authentication token is missing',
    INVALID_TOKEN: 'Invalid or expired token',
    NO_ROLE_FOUND: 'Access denied. No role found.',
    INSUFFICIENT_PERMISSIONS: 'Access denied. Insufficient permissions.',
  },
  PROVIDER_SERVICE: {
    CREATE_FAILED: 'Failed to create service',
    LIST_FAILED: 'Failed to fetch services',
  },
};
