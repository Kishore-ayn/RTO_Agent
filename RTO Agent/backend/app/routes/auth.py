from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.user import User

from app.schemas.user import LoginRequest
from app.schemas.user import ChangePasswordRequest

from app.utils.security import verify_password
from app.utils.security import hash_password

from app.utils.jwt_handler import create_access_token

from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    
    user = (
        db.query(User)
        .filter(
            User.USERNAME == login_data.username
        )
        .first()
    )
    if user is None:
        return {
            "message": "Invalid Username or Password"
        }

    if not verify_password(
        login_data.password,
        user.PASSWORD_HASH
    ):
        return {
            "message": "Invalid Username or Password"
        }

    token = create_access_token(
        {
            "sub": user.USERNAME
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    user = (
        db.query(User)
        .filter(User.USERNAME == current_user)
        .first()
    )

    if user is None:
        return {
            "message": "User Not Found"
        }

    if not verify_password(
        payload.old_password,
        user.PASSWORD_HASH
    ):
        return {
            "message": "Current Password is Incorrect"
        }

    user.PASSWORD_HASH = hash_password(payload.new_password)

    db.commit()

    return {
        "message": "Password Changed Successfully"
    }