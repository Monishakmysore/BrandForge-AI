from datetime import datetime

from .brand import db


class Content(db.Model):
    __tablename__ = "content"

    id = db.Column(db.Integer, primary_key=True)

    campaign_id = db.Column(
        db.Integer,
        db.ForeignKey("campaigns.id"),
        nullable=False
    )

    content_type = db.Column(
        db.String(100),
        nullable=False
    )

    content = db.Column(
        db.Text,
        nullable=False
    )

    platform = db.Column(
        db.String(100),
        nullable=True
    )

    status = db.Column(
        db.String(50),
        default="draft"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "campaign_id": self.campaign_id,
            "content_type": self.content_type,
            "content": self.content,
            "platform": self.platform,
            "status": self.status,
            "created_at": self.created_at.isoformat()
            if self.created_at else None
        }