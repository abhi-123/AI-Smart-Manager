from pydantic import BaseModel


class SubTaskRequest(BaseModel):
   title: str
