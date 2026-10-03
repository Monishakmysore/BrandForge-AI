from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import flask

from werkzeug.security import generate_password_hash, check_password_hash

from models import db
from models.brand import Brand
from models.campaign import Campaign
from models.content import Content
from models.user import User


# --------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# --------------------------------------------------

load_dotenv()


# --------------------------------------------------
# CREATE FLASK APP
# --------------------------------------------------

app = Flask(__name__)


# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    }
)


# --------------------------------------------------
# DATABASE CONFIGURATION
# --------------------------------------------------

# Railway provides MYSQL_URL for the MySQL service.
# When running locally, the local MySQL connection is used.
DATABASE_URL = os.getenv(
    "MYSQL_URL",
    "mysql+pymysql://root:Moulya@localhost/brandforge"
)

# Railway may provide MYSQL_URL using mysql://.
# SQLAlchemy needs the PyMySQL driver explicitly.
if DATABASE_URL.startswith("mysql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "mysql://",
        "mysql+pymysql://",
        1
    )

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


# ==================================================
# HOME
# ==================================================

@app.route("/")
def home():

    return jsonify({
        "message": "BrandForge AI Content Studio is running!",
        "status": "success"
    })


# ==================================================
# HEALTH CHECK
# ==================================================

@app.route("/health")
def health():

    return jsonify({
        "status": "healthy"
    })


# ==================================================
# TEST DATABASE
# ==================================================

@app.route("/api/test-db")
def test_db():

    count = Brand.query.count()

    return jsonify({
        "status": "success",
        "message": "Database connected successfully!",
        "brands": count
    })


# ==================================================
# USER / AUTHENTICATION APIs
# ==================================================

# --------------------------------------------------
# REGISTER USER
# --------------------------------------------------

@app.route("/api/register", methods=["POST"])
def register_user():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No JSON data provided"
        }), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name:
        return jsonify({
            "status": "error",
            "message": "Name is required"
        }), 400

    if not email:
        return jsonify({
            "status": "error",
            "message": "Email is required"
        }), 400

    if not password:
        return jsonify({
            "status": "error",
            "message": "Password is required"
        }), 400

    # Check whether email already exists
    existing_user = User.query.filter_by(
        email=email
    ).first()

    if existing_user:
        return jsonify({
            "status": "error",
            "message": "Email is already registered"
        }), 409

    # Hash password before saving
    hashed_password = generate_password_hash(password)

    user = User(
        name=name,
        email=email,
        password=hashed_password,
        password_display=password,
        role="user"
    )

    try:

        db.session.add(user)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Registration successful!",
            "user": user.to_dict()
        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": "Registration failed",
            "error": str(e)
        }), 500


# --------------------------------------------------
# LOGIN USER
# --------------------------------------------------

@app.route("/api/login", methods=["POST"])
def login_user():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No JSON data provided"
        }), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email:
        return jsonify({
            "status": "error",
            "message": "Email is required"
        }), 400

    if not password:
        return jsonify({
            "status": "error",
            "message": "Password is required"
        }), 400

    # Find user by email
    user = User.query.filter_by(
        email=email
    ).first()

    if not user:
        return jsonify({
            "status": "error",
            "message": "Invalid email or password"
        }), 401

    # Check password
    if not check_password_hash(
        user.password,
        password
    ):
        return jsonify({
            "status": "error",
            "message": "Invalid email or password"
        }), 401

    return jsonify({
        "status": "success",
        "message": "Login successful!",
        "user": user.to_dict()
    }), 200


# --------------------------------------------------
# GET ALL USERS
# --------------------------------------------------

@app.route("/api/users", methods=["GET"])
def get_users():

    users = User.query.order_by(
        User.created_at.desc()
    ).all()

    return jsonify({
        "status": "success",
        "count": len(users),
        "users": [
            user.to_dict()
            for user in users
        ]
    })


# ==================================================
# BRAND APIs
# ==================================================

# --------------------------------------------------
# CREATE BRAND
# --------------------------------------------------

@app.route("/api/brands", methods=["POST"])
def create_brand():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No JSON data provided"
        }), 400

    if not data.get("name"):
        return jsonify({
            "status": "error",
            "message": "Brand name is required"
        }), 400

    brand = Brand(
        name=data.get("name"),
        description=data.get("description"),
        target_audience=data.get("target_audience"),
        tone=data.get("tone"),
        personality=data.get("personality"),
        preferred_words=data.get("preferred_words"),
        words_to_avoid=data.get("words_to_avoid"),
        primary_color=data.get("primary_color"),
        secondary_color=data.get("secondary_color"),
        logo_url=data.get("logo_url")
    )

    db.session.add(brand)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Brand created successfully!",
        "brand": brand.to_dict()
    }), 201


# --------------------------------------------------
# GET ALL BRANDS
# --------------------------------------------------

@app.route("/api/brands", methods=["GET"])
def get_brands():

    brands = Brand.query.order_by(
        Brand.created_at.desc()
    ).all()

    return jsonify({
        "status": "success",
        "count": len(brands),
        "brands": [
            brand.to_dict()
            for brand in brands
        ]
    })


# --------------------------------------------------
# GET SINGLE BRAND
# --------------------------------------------------

@app.route("/api/brands/<int:brand_id>", methods=["GET"])
def get_brand(brand_id):

    brand = db.session.get(
        Brand,
        brand_id
    )

    if not brand:
        return jsonify({
            "status": "error",
            "message": "Brand not found"
        }), 404

    return jsonify({
        "status": "success",
        "brand": brand.to_dict()
    })


# --------------------------------------------------
# UPDATE BRAND
# --------------------------------------------------

@app.route("/api/brands/<int:brand_id>", methods=["PUT"])
def update_brand(brand_id):

    brand = db.session.get(
        Brand,
        brand_id
    )

    if not brand:
        return jsonify({
            "status": "error",
            "message": "Brand not found"
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No JSON data provided"
        }), 400

    if "name" in data:
        brand.name = data["name"]

    if "description" in data:
        brand.description = data["description"]

    if "target_audience" in data:
        brand.target_audience = data["target_audience"]

    if "tone" in data:
        brand.tone = data["tone"]

    if "personality" in data:
        brand.personality = data["personality"]

    if "preferred_words" in data:
        brand.preferred_words = data["preferred_words"]

    if "words_to_avoid" in data:
        brand.words_to_avoid = data["words_to_avoid"]

    if "primary_color" in data:
        brand.primary_color = data["primary_color"]

    if "secondary_color" in data:
        brand.secondary_color = data["secondary_color"]

    if "logo_url" in data:
        brand.logo_url = data["logo_url"]

    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Brand updated successfully!",
        "brand": brand.to_dict()
    })


# ==================================================
# CAMPAIGN APIs
# ==================================================

# --------------------------------------------------
# CREATE CAMPAIGN
# --------------------------------------------------

@app.route("/api/campaigns", methods=["POST"])
def create_campaign():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No JSON data provided"
        }), 400

    if not data.get("brand_id"):
        return jsonify({
            "status": "error",
            "message": "brand_id is required"
        }), 400

    if not data.get("name"):
        return jsonify({
            "status": "error",
            "message": "Campaign name is required"
        }), 400

    if not data.get("idea"):
        return jsonify({
            "status": "error",
            "message": "Campaign idea is required"
        }), 400

    brand = db.session.get(
        Brand,
        data.get("brand_id")
    )

    if not brand:
        return jsonify({
            "status": "error",
            "message": "Brand not found"
        }), 404

    campaign = Campaign(
        brand_id=brand.id,
        name=data.get("name"),
        idea=data.get("idea"),
        objective=data.get("objective"),
        target_audience=data.get("target_audience"),
        key_message=data.get("key_message"),
        platforms=data.get("platforms"),
        status=data.get("status", "draft")
    )

    db.session.add(campaign)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Campaign created successfully!",
        "campaign": campaign.to_dict()
    }), 201


# --------------------------------------------------
# GET ALL CAMPAIGNS
# --------------------------------------------------

@app.route("/api/campaigns", methods=["GET"])
def get_campaigns():

    campaigns = Campaign.query.order_by(
        Campaign.created_at.desc()
    ).all()

    return jsonify({
        "status": "success",
        "count": len(campaigns),
        "campaigns": [
            campaign.to_dict()
            for campaign in campaigns
        ]
    })


# --------------------------------------------------
# GET SINGLE CAMPAIGN
# --------------------------------------------------

@app.route("/api/campaigns/<int:campaign_id>", methods=["GET"])
def get_campaign(campaign_id):

    campaign = db.session.get(
        Campaign,
        campaign_id
    )

    if not campaign:
        return jsonify({
            "status": "error",
            "message": "Campaign not found"
        }), 404

    return jsonify({
        "status": "success",
        "campaign": campaign.to_dict()
    })


# --------------------------------------------------
# ACTUAL UPDATE CAMPAIGN ROUTE
# --------------------------------------------------

@app.route("/api/campaigns/<int:campaign_id>", methods=["PUT"])
def update_campaign_data(campaign_id):

    campaign = db.session.get(
        Campaign,
        campaign_id
    )

    if not campaign:
        return jsonify({
            "status": "error",
            "message": "Campaign not found"
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No JSON data provided"
        }), 400

    if "name" in data:
        campaign.name = data["name"]

    if "idea" in data:
        campaign.idea = data["idea"]

    if "objective" in data:
        campaign.objective = data["objective"]

    if "target_audience" in data:
        campaign.target_audience = data["target_audience"]

    if "key_message" in data:
        campaign.key_message = data["key_message"]

    if "platforms" in data:
        campaign.platforms = data["platforms"]

    if "status" in data:
        campaign.status = data["status"]

    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Campaign updated successfully!",
        "campaign": campaign.to_dict()
    })


# ==================================================
# AI CONTENT GENERATION
# ==================================================

@app.route("/api/generate-content", methods=["POST"])
def generate_content():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No JSON data provided"
        }), 400

    campaign_id = data.get("campaign_id")

    if not campaign_id:
        return jsonify({
            "status": "error",
            "message": "campaign_id is required"
        }), 400

    campaign = db.session.get(
        Campaign,
        campaign_id
    )

    if not campaign:
        return jsonify({
            "status": "error",
            "message": "Campaign not found"
        }), 404

    brand = db.session.get(
        Brand,
        campaign.brand_id
    )

    if not brand:
        return jsonify({
            "status": "error",
            "message": "Brand not found"
        }), 404

    brand_name = brand.name

    tone = brand.tone or "friendly and professional"

    target_audience = (
        campaign.target_audience
        or brand.target_audience
        or "our target audience"
    )

    key_message = (
        campaign.key_message
        or campaign.idea
        or "Make a positive difference."
    )

    campaign_idea = (
        campaign.idea
        or "Create meaningful impact."
    )

    instagram_content = (
        f"🌱 {key_message}\n\n"
        f"{campaign_idea}\n\n"
        f"Join {brand_name} and be part of the change. "
        f"Together, we can turn small actions into meaningful impact.\n\n"
        f"👉 Take action today!\n\n"
        f"#BrandForge #Sustainability #CampusLife #MakeADifference"
    )

    linkedin_content = (
        f"{brand_name} is turning an important idea into action.\n\n"
        f"{campaign_idea}\n\n"
        f"Our goal is to engage {target_audience} and encourage "
        f"meaningful participation through a simple, actionable campaign.\n\n"
        f"Key message: {key_message}\n\n"
        f"Let's turn awareness into action and create measurable "
        f"positive change.\n\n"
        f"#BrandForge #Campaign #Sustainability"
    )

    x_content = (
        f"{key_message} 🌱\n\n"
        f"{campaign_idea}\n\n"
        f"Take action today with {brand_name}.\n\n"
        f"#BrandForge #Sustainability"
    )

    generated_content = {
        "instagram": instagram_content,
        "linkedin": linkedin_content,
        "x": x_content
    }

    created_content = []

    platform_map = {
        "instagram": "Instagram",
        "linkedin": "LinkedIn",
        "x": "X"
    }

    try:

        for key, platform in platform_map.items():

            content_text = generated_content.get(key)

            if not content_text:
                continue

            content = Content(
                campaign_id=campaign.id,
                content_type="Social Media Post",
                content=content_text,
                platform=platform,
                status="draft"
            )

            db.session.add(content)
            created_content.append(content)

        db.session.commit()

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": "Failed to save generated content.",
            "error": str(e)
        }), 500

    return jsonify({
        "status": "success",
        "message": "Content generated successfully!",
        "mode": "demo",
        "campaign_id": campaign.id,
        "brand": brand_name,
        "tone": tone,
        "content": [
            item.to_dict()
            for item in created_content
        ]
    }), 201


# ==================================================
# CONTENT APIs
# ==================================================

# --------------------------------------------------
# CREATE CONTENT
# --------------------------------------------------

@app.route("/api/content", methods=["POST"])
def create_content():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No JSON data provided"
        }), 400

    if not data.get("campaign_id"):
        return jsonify({
            "status": "error",
            "message": "campaign_id is required"
        }), 400

    if not data.get("content_type"):
        return jsonify({
            "status": "error",
            "message": "content_type is required"
        }), 400

    if not data.get("content"):
        return jsonify({
            "status": "error",
            "message": "Content is required"
        }), 400

    campaign = db.session.get(
        Campaign,
        data.get("campaign_id")
    )

    if not campaign:
        return jsonify({
            "status": "error",
            "message": "Campaign not found"
        }), 404

    content = Content(
        campaign_id=campaign.id,
        content_type=data.get("content_type"),
        content=data.get("content"),
        platform=data.get("platform"),
        status=data.get("status", "draft")
    )

    db.session.add(content)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Content created successfully!",
        "content": content.to_dict()
    }), 201


# --------------------------------------------------
# GET ALL CONTENT
# --------------------------------------------------

@app.route("/api/content", methods=["GET"])
def get_content():

    contents = Content.query.order_by(
        Content.created_at.desc()
    ).all()

    return jsonify({
        "status": "success",
        "count": len(contents),
        "content": [
            item.to_dict()
            for item in contents
        ]
    })


# --------------------------------------------------
# GET SINGLE CONTENT
# --------------------------------------------------

@app.route("/api/content/<int:content_id>", methods=["GET"])
def get_single_content(content_id):

    content = db.session.get(
        Content,
        content_id
    )

    if not content:
        return jsonify({
            "status": "error",
            "message": "Content not found"
        }), 404

    return jsonify({
        "status": "success",
        "content": content.to_dict()
    })


# --------------------------------------------------
# UPDATE CONTENT
# --------------------------------------------------

@app.route("/api/content/<int:content_id>", methods=["PUT", "OPTIONS"])
def update_content(content_id):

    # Browsers may send an OPTIONS preflight request before PUT.
    if request.method == "OPTIONS":
        return ("", 204)

    content = db.session.get(
        Content,
        content_id
    )

    if not content:
        return jsonify({
            "status": "error",
            "message": "Content not found"
        }), 404

    data = request.get_json(silent=True) or {}

    new_content = data.get("content")

    if not isinstance(new_content, str) or not new_content.strip():
        return jsonify({
            "status": "error",
            "message": "Content cannot be empty"
        }), 400

    try:
        content.content = new_content.strip()

        if "status" in data and data.get("status"):
            content.status = data.get("status")

        if "platform" in data and data.get("platform"):
            content.platform = data.get("platform")

        if "content_type" in data and data.get("content_type"):
            content.content_type = data.get("content_type")

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Content updated successfully!",
            "content": content.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": "Failed to update content.",
            "error": str(e)
        }), 500



# ==================================================
# CREATE DATABASE TABLES
# ==================================================

with app.app_context():
    db.create_all()


# ==================================================
# RUN APPLICATION
# ==================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5001
    )