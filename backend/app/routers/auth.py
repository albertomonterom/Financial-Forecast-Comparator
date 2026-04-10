from fastapi import APIRouter, HTTPException
from bson import ObjectId
from ..database import db
from ..schemas.auth import RegisterRequest, LoginRequest, AuthResponse, UserOut
from ..core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
async def register(data: RegisterRequest):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    return AuthResponse(
        token=create_access_token(user_id),
        user=UserOut(id=user_id, name=data.name, email=data.email),
    )


@router.post("/login", response_model=AuthResponse)
async def login(data: LoginRequest):
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user["_id"])
    return AuthResponse(
        token=create_access_token(user_id),
        user=UserOut(id=user_id, name=user["name"], email=user["email"]),
    )


@router.get("/me", response_model=UserOut)
async def me(user_id: str = None):
    # Protected route example — wired in main.py with get_current_user_id
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(id=user_id, name=user["name"], email=user["email"])
