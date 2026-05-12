from fastapi import APIRouter
from app.api.v1 import resume, interview, session, report

api_router = APIRouter()

api_router.include_router(resume.router, prefix="/resume", tags=["resume"])
api_router.include_router(interview.router, prefix="/interview", tags=["interview"])
api_router.include_router(session.router, prefix="/session", tags=["session"])
api_router.include_router(report.router, prefix="/report", tags=["report"])
