from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
from bson import ObjectId
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..config import settings

bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": user_id, "exp": expire},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_token(token: str) -> str:
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
) -> str:
    return decode_token(credentials.credentials)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
):
    from ..database import db  # local import to avoid circular dependency
    user_id = decode_token(credentials.credentials)
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
