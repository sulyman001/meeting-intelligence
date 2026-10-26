
import uuid

import jwt

from fastapi import Depends, HTTPException, status
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User


# Read Bearer tokens from the Authorization header
bearer_scheme = HTTPBearer(auto_error=False)


def authentication_error():
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        bearer_scheme
    ),
    db: Session = Depends(get_db),
) -> User:

    # Step 1: Confirm a Bearer token was provided
    if credentials is None:
        raise authentication_error()

    # Step 2: Verify the JWT
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret_key,
            algorithms=["HS256"],
            options={"require": ["sub", "exp", "iat"]},
        )

        # Only access tokens are accepted
        if payload.get("type") != "access":
            raise authentication_error()

        # Extract user ID
        user_id = uuid.UUID(payload["sub"])

    except (jwt.InvalidTokenError, ValueError, TypeError, KeyError):
        raise authentication_error()

    # Step 3: Retrieve user from PostgreSQL
    user = db.get(User, user_id)

    if user is None:
        raise authentication_error()

    # Step 4: Reject inactive accounts
    if not user.is_active:
        raise authentication_error()

    return user
