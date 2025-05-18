"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, Incidentes, Likes, Reports
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta
from sqlalchemy.orm import joinedload



# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

jwt = JWTManager(app)


# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)
CORS(app)
bcrypt = Bcrypt(app)


# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route('/api/singup', methods=['POST'])
def signup():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'Debes enviar la información en el body'}), 400
    
    # Verificar campos obligatorios
    if 'username' not in body:
        return jsonify({'msg': 'El campo username es obligatorio'}), 400
    if 'name' not in body:
        return jsonify({'msg': 'El campo name es obligatorio'}), 400
    if 'phone' not in body:
        return jsonify({'msg': 'El campo phone es obligatorio'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'El campo email es obligatorio'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'El campo password es obligatorio'}), 400
    
    # Verificar si el email,phone,usuarios ya existe
    email_exists = User.query.filter_by(email=body['email']).first()
    if email_exists:
        return jsonify({'msg': 'El email ya está registrado'}), 400
    phone_exists = User.query.filter_by(phone=body['phone']).first()
    if phone_exists:
        return jsonify({'msg': 'El telefono ya está registrado'}), 400
    user_exists = User.query.filter_by(username=body['username']).first()
    if user_exists:
        return jsonify({'msg': 'El nombre de usuario ya está registrado'}), 400
    
    # Crear nuevo usuario (is_active = True por defecto, is_admin = False por defecto)
    new_user = User(
        username=body['username'],
        name=body['name'],
        phone=body['phone'],
        email=body['email'],
        password=bcrypt.generate_password_hash(body['password']).decode('utf-8'),
        is_active=True,
        is_admin=False
    )
    
    # Guardar en la base de datos
    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({
            'msg': 'Usuario registrado exitosamente',
            'user': new_user.serialize()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error al registrar usuario: {str(e)}'}), 500
    

@app.route('/api/login', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    if body is None:
      return jsonify({'msg': 'Debes enviar la informacion en el body'}), 400
    if 'email' not in body:
        return jsonify({'msg':'El campo email es obligatorio'}),400
    if 'password' not in body:
        return jsonify({'msg': "El campo password es obligatorio"}), 400
    user = User.query.filter_by(email = body['email']).first()
    if user is None:
        return jsonify({'msg':'Email o contraseña invalidos'}), 400
    #2 revisar si contraseña es correcta
    password_valid = bcrypt.check_password_hash(user.password, body['password'])
    if not password_valid:
        return jsonify({'msg': "Email o contraseña invalidos"}), 400
    if not user.is_active:
        return jsonify({'msg': "Usuario baneado. Por favor contacte a un administrador."}), 403
    #3 crear token
    acces_token = create_access_token(identity= user.email)
    return({'msg': 'Estas logeado', 'token': acces_token}), 200

@app.route('/api/private', methods=['GET'])
@jwt_required()
def private():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    return jsonify(user.serialize()), 200

@app.route('/api/admin', methods=['GET'])
@jwt_required()
def admin_reported_incidents():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user or not user.is_active:
        return jsonify({'msg': 'Acceso denegado. Usuario baneado o eliminado.'}), 403
    
    if not user.is_admin:
        return jsonify({'msg': 'Acceso denegado. Se requieren privilegios de administrador.'}), 403
    
    incidents = Incidentes.query.options(joinedload(Incidentes.reports).joinedload(Reports.user)).all()
    
    reported_incidents = []
    
    for incident in incidents:
        num_reports = len(incident.reports)
        num_likes = len(incident.likes)
        
        if num_likes > 0:
            ratio = (num_reports / num_likes) * 100
            
            if ratio >= 75:
                incident_data = incident.serialize()
                incident_data['num_reports'] = num_reports
                incident_data['num_likes'] = num_likes
                incident_data['reports'] = [
                    {
                        'id': report.id,
                        'type': report.reportType,
                        'description': report.description,
                        'user_id': report.user_id,
                        'username': report.user.username if report.user else "Desconocido"
                    } for report in incident.reports
                ]
                
                reported_incidents.append(incident_data)
        
        elif num_reports > 0:
            incident_data = incident.serialize()
            incident_data['num_reports'] = num_reports
            incident_data['num_likes'] = 0
            incident_data['reports'] = [
                {
                    'id': report.id,
                    'type': report.reportType,
                    'description': report.description,
                    'user_id': report.user_id,
                    'user': report.user.username if report.user else "Desconocido"
                } for report in incident.reports
            ]
            
            reported_incidents.append(incident_data)
    
    return jsonify({
        'reported_incidents': reported_incidents, 
        'count': len(reported_incidents)
    })

@app.route('/api/subir-pin', methods = ['POST'])
def subirpin():
    body = request.get_json(silent = True)
    if body is None:
        return jsonify({'msg':'Debes enviar la informacion en el body'}), 400
    if 'longitud' not in body:
        return jsonify({'msg':'El campo longitud es obligatorio'}), 400
    if 'latitud' not in body:
        return jsonify({'msg':'El campo latitud es obligatorio'}), 400
    if 'type' not in body:
        return jsonify({'msg':'El campo type es obligatorio'}), 400
    if 'description' not in body:
        return jsonify({'msg':'El campo description es obligatorio'}), 400
    
    new_incident = Incidentes(
        image = body['image'],
        longitud = body['longitud'],
        latitud = body['latitud'],
        type = body['type'],
        description = body['description'],
        user_id = body['user_id'],
    )

    db.session.add(new_incident)
    try:
        db.session.commit()
        return jsonify({
            'msg': 'Incidente registrado exitosamente',
            'incidente': new_incident.serialize()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg':f'error al registrar incidente:{str(e)}'}),500
    
@app.route('/api/ban-user/<int:user_id>', methods = ['PUT'])
@jwt_required()
def ban_user(user_id):
    user = User.query.get(user_id)
    admin_email = get_jwt_identity()
    admin = User.query.filter_by(email = admin_email).first()
    if user.id == admin.id:
        return jsonify({'msg': 'No puedes banearte a ti mismo.'}), 400
    
    user.is_active = False

    try:
        db.session.commit()
        return jsonify({
            'msg': f'Usuario {user.username} baneado exitosamente',
            'user': user.serialize()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error al banear usuario: {str(e)}'}), 500


@app.route('/api/delete-incident/<int:incident_id>', methods=['DELETE'])
@jwt_required()
def delete_incident(incident_id):
    incident = Incidentes.query.get(incident_id)
    if not incident:
        return jsonify({'msg': 'Incidente no encontrado'}), 404
    
    db.session.delete(incident)
    
    try:
        db.session.commit()
        return jsonify({
            'msg': 'Incidente eliminado exitosamente',
            'incident_id': incident_id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error al eliminar incidente: {str(e)}'}), 500

@app.route('/api/all-incidents', methods=['GET'])
def all_incidentes():
    incidents_query = Incidentes.query.all()    

    response_body = {
        "msg": "Success",
        "results": list(map(lambda incident: incident.serialize(), incidents_query)),
    }
    return jsonify(response_body),200

@app.route('/api/incidents/<string:type>',methods=['GET'])
def get_incidents_by_type(type):
    incidents_query = Incidentes.query.filter_by(type=type).all()
    if not incidents_query:
        return jsonify({'msg': f'No se encontraron incidentes del tipo "{type}"'}),404
    
    response_body = {
        'msg': 'Success',
        'results': list(map(lambda incident: incident.serialize(), incidents_query))
    }
    return jsonify(response_body),200

@app.route('/api/incident/<int:incident_id>', methods=['GET'])
@jwt_required()
def like_incident(incident_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    existing_like = Likes.query.filter_by(user_id=user.id, incident_id=incident_id).first()
    if existing_like:
       return jsonify({'msg': 'Ya has dado like a este incidente'}),400
    
    new_like = Likes(user_id=user.id, incident_id=incident_id)
    db.session.add(new_like)
    try:
        db.session.commit()
        return jsonify({'msg': 'Like agregado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error al agregar like: {str(e)}'}), 500
    
@app.route('/api/report/<int:incident_id>', methods=['POST'])
@jwt_required()
def report_incident(incident_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email = current_user_email).first()
    body = request.get_json(silent=True)
    if not body or not body.get('reportType'):
        return jsonify({'msg': 'Debes elegir un tipo de reporte'}), 400
    if not body.get('description'):
        return jsonify({'msg': 'Debes ingresar una descripcion'}), 400

    existing_report = Reports.query.filter_by(user_id = user.id, incident_id = incident_id).first()
    if existing_report:
        return jsonify({'msg': 'Ya has reportado este incidente'}), 400

    new_report = Reports(
        user_id=user.id,
        incident_id=incident_id,
        reportType=body['reportType'],
        description=body['description']
    )
    db.session.add(new_report)
    try:
        db.session.commit()
        return jsonify({'msg': 'Reporte agregado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error al agregar reporte: {str(e)}'}), 500   




# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
