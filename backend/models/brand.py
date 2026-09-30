from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Brand(db.Model):
    __tablename__ = "brands"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(120), nullable=False)

    description = db.Column(db.Text)

    target_audience = db.Column(db.Text)

    tone = db.Column(db.String(100))

    personality = db.Column(db.String(255))

    preferred_words = db.Column(db.Text)

    words_to_avoid = db.Column(db.Text)

    primary_color = db.Column(db.String(20))

    secondary_color = db.Column(db.String(20))

    logo_url = db.Column(db.String(500))

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "target_audience": self.target_audience,
            "tone": self.tone,
            "personality": self.personality,
            "preferred_words": self.preferred_words,
            "words_to_avoid": self.words_to_avoid,
            "primary_color": self.primary_color,
            "secondary_color": self.secondary_color,
            "logo_url": self.logo_url,
            "created_at": self.created_at.isoformat()
            if self.created_at else None
        }