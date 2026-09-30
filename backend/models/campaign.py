from datetime import datetime

from .brand import db


class Campaign(db.Model):
    __tablename__ = "campaigns"

    id = db.Column(db.Integer, primary_key=True)

    brand_id = db.Column(
        db.Integer,
        db.ForeignKey("brands.id"),
        nullable=False
    )

    name = db.Column(db.String(200), nullable=False)
    idea = db.Column(db.Text, nullable=False)

    objective = db.Column(db.Text)
    target_audience = db.Column(db.Text)
    key_message = db.Column(db.Text)
    platforms = db.Column(db.String(500))

    status = db.Column(
        db.String(50),
        default="draft",
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "brand_id": self.brand_id,
            "name": self.name,
            "idea": self.idea,
            "objective": self.objective,
            "target_audience": self.target_audience,
            "key_message": self.key_message,
            "platforms": self.platforms,
            "status": self.status,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            )
        }

