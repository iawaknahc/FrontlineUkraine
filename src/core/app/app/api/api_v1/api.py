from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    address,
    items,
    login,
    map,
    need,
    supply,
    users,
    utils,
)

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(map.router, prefix="/map", tags=["map"])
api_router.include_router(supply.router, prefix="/supply", tags=["supply"])
api_router.include_router(need.router, prefix="/need", tags=["needs"])
api_router.include_router(address.router, prefix="/address", tags=["addresses"])
